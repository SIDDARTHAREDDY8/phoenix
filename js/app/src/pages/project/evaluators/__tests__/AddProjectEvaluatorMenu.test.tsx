import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import type * as ReactRelay from "react-relay";
import type * as ReactRouter from "react-router";
import { userEvent, waitFor } from "storybook/test";

import { ThemeContext } from "@phoenix/contexts/ThemeContext";

import {
  AddProjectEvaluatorMenu,
  BuildProjectEvaluatorMenu,
} from "../AddProjectEvaluatorMenu";

const { navigate, evaluatorEdges } = vi.hoisted(() => ({
  navigate: vi.fn(),
  evaluatorEdges: { current: [] as unknown[] },
}));

const CURRENT_PROJECT = { id: "project-1", name: "checkout-agent" };
const OTHER_PROJECT = { id: "project-2", name: "support-bot" };

/** An evaluator as the menu's query returns it, used in the given projects. */
const evaluatorEdge = ({
  usedIn = [OTHER_PROJECT],
  ...evaluator
}: {
  __typename: string;
  id: string;
  name: string;
  kind: string;
  usedIn?: ReadonlyArray<{ id: string; name: string }>;
}) => ({
  evaluator: {
    ...evaluator,
    description: null,
    projects: { edges: usedIn.map((project) => ({ project })) },
    datasets: { edges: [] },
  },
});

const llmEdge = evaluatorEdge({
  __typename: "LLMEvaluator",
  id: "llm-1",
  name: "correctness",
  kind: "LLM",
});
const codeEdge = evaluatorEdge({
  __typename: "CodeEvaluator",
  id: "code-1",
  name: "exact_match",
  kind: "CODE",
});
const decisionEdge = evaluatorEdge({
  __typename: "DecisionEvaluator",
  id: "decision-1",
  name: "relevance",
  kind: "DECISION",
});

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof ReactRouter>()),
  useNavigate: () => navigate,
  useParams: () => ({ projectId: CURRENT_PROJECT.id }),
}));

vi.mock("react-relay", async (importOriginal) => ({
  ...(await importOriginal<typeof ReactRelay>()),
  useLazyLoadQuery: () => ({
    evaluators: {
      edges: evaluatorEdges.current,
      pageInfo: { hasNextPage: false },
    },
  }),
}));

vi.mock("@phoenix/pages/project/evaluators/projectEvaluatorPaths", () => ({
  useProjectEvaluatorPaths: () => ({ gallery: () => "/gallery" }),
  useProjectEvaluatorCreationPaths: () => ({
    newLlm: "/new/llm",
    newCode: "/new/code",
    newDecision: "/new/decision",
    copyLlm: (id: string) => `/new/copy-llm/${id}`,
    copyCode: (id: string) => `/new/copy-code/${id}`,
    copyDecision: (id: string) => `/new/copy-decision/${id}`,
    attach: (id: string) => `/new/attach/${id}`,
  }),
}));

const getMenuItemNames = () =>
  Array.from(document.querySelectorAll('[role="menuitem"]')).map(
    (item) => item.getAttribute("aria-label") ?? item.textContent?.trim()
  );

describe("project evaluator menus", () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    navigate.mockReset();
    evaluatorEdges.current = [llmEdge];
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  const render = async (children: React.ReactNode) => {
    await act(async () => {
      root.render(
        <ThemeContext.Provider
          value={{
            theme: "dark",
            themeMode: "dark",
            systemTheme: "dark",
            setThemeMode: vi.fn(),
          }}
        >
          {children}
        </ThemeContext.Provider>
      );
    });
  };

  it("builds from scratch with one blank evaluator per kind", async () => {
    await render(<BuildProjectEvaluatorMenu size="S" defaultOpen />);
    expect(getMenuItemNames()).toEqual([
      "New LLM evaluator",
      "New code evaluator",
      "New decision evaluator",
    ]);
    const codeItem = Array.from(
      document.querySelectorAll('[role="menuitem"]')
    ).find((item) => item.textContent?.trim() === "New code evaluator");
    await act(async () => (codeItem as HTMLElement).click());
    expect(navigate).toHaveBeenCalledWith("/new/code");
  });

  it("titles sections by kind and offers only the existing evaluators there are", async () => {
    await render(
      <AddProjectEvaluatorMenu
        size="M"
        shouldShowGalleryLink={false}
        defaultOpen
      />
    );
    const sectionTitles = Array.from(
      document.querySelectorAll('[role="menu"] header')
    ).map((header) => header.textContent);
    expect(sectionTitles).toEqual(["LLM", "Code", "Decision"]);
    // There is an LLM evaluator to copy, but no code or decision evaluator
    // to use or copy.
    expect(getMenuItemNames()).toEqual([
      "New LLM evaluator",
      "Copy existing LLM evaluator",
      "New code evaluator",
      "New decision evaluator",
    ]);
  });

  it("offers every kind New and Copy existing, and only code Add existing", async () => {
    evaluatorEdges.current = [llmEdge, codeEdge, decisionEdge];
    await render(
      <AddProjectEvaluatorMenu
        size="M"
        shouldShowGalleryLink={false}
        defaultOpen
      />
    );
    expect(getMenuItemNames()).toEqual([
      "New LLM evaluator",
      "Copy existing LLM evaluator",
      "New code evaluator",
      "Copy existing code evaluator",
      "Add existing code evaluator",
      "New decision evaluator",
      "Copy existing decision evaluator",
    ]);
  });

  /** Opens a kind's existing-evaluator submenu the way a pointer user does. */
  const openSubmenu = async (label: string) => {
    const submenuTrigger = Array.from(
      document.querySelectorAll<HTMLElement>('[role="menuitem"]')
    ).find((item) => item.textContent?.trim() === label);
    expect(submenuTrigger, label).toBeDefined();
    await userEvent.setup().click(submenuTrigger as HTMLElement);
    await waitFor(() =>
      expect(
        document.querySelector(`[role="menu"][aria-label="${label}"]`)
      ).not.toBeNull()
    );
  };
  const getSubmenuItems = (label: string) =>
    Array.from(
      document.querySelectorAll<HTMLElement>(
        `[role="menu"][aria-label="${label}"] [role="menuitem"]`
      )
    );

  it("copies a decision evaluator rather than sharing it", async () => {
    evaluatorEdges.current = [decisionEdge];
    await render(
      <AddProjectEvaluatorMenu
        size="M"
        shouldShowGalleryLink={false}
        defaultOpen
      />
    );
    await openSubmenu("Copy existing decision evaluator");
    const [decisionItem] = getSubmenuItems("Copy existing decision evaluator");
    expect(decisionItem.textContent).toContain("relevance");
    await userEvent.setup().click(decisionItem);
    expect(navigate).toHaveBeenCalledWith("/new/copy-decision/decision-1");
  });

  it("narrows a copy submenu to the evaluators whose names match the search", async () => {
    evaluatorEdges.current = [
      decisionEdge,
      evaluatorEdge({
        __typename: "DecisionEvaluator",
        id: "decision-2",
        name: "toxicity",
        kind: "DECISION",
      }),
    ];
    await render(
      <AddProjectEvaluatorMenu
        size="M"
        shouldShowGalleryLink={false}
        defaultOpen
      />
    );
    const label = "Copy existing decision evaluator";
    await openSubmenu(label);
    expect(getSubmenuItems(label)).toHaveLength(2);
    const search = document.querySelector<HTMLInputElement>(
      `input[aria-label="Search ${label.toLowerCase()}"]`
    );
    expect(search).not.toBeNull();
    await userEvent.setup().type(search as HTMLInputElement, "tox");
    const items = getSubmenuItems(label);
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toContain("toxicity");
  });

  it("says where each evaluator is used, and only adds one this project lacks", async () => {
    evaluatorEdges.current = [
      evaluatorEdge({
        __typename: "CodeEvaluator",
        id: "code-here",
        name: "exact_match",
        kind: "CODE",
        usedIn: [CURRENT_PROJECT, OTHER_PROJECT],
      }),
      evaluatorEdge({
        __typename: "CodeEvaluator",
        id: "code-elsewhere",
        name: "json_valid",
        kind: "CODE",
      }),
    ];
    await render(
      <AddProjectEvaluatorMenu
        size="M"
        shouldShowGalleryLink={false}
        defaultOpen
      />
    );
    await openSubmenu("Copy existing code evaluator");
    expect(
      getSubmenuItems("Copy existing code evaluator").map(
        (item) => item.textContent
      )
    ).toEqual([
      expect.stringContaining("Used in this project, support-bot"),
      expect.stringContaining("Used in support-bot"),
    ]);
    await openSubmenu("Add existing code evaluator");
    const addable = getSubmenuItems("Add existing code evaluator");
    expect(addable).toHaveLength(1);
    expect(addable[0].textContent).toContain("json_valid");
  });
});
