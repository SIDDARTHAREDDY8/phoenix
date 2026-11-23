/**
 * @generated SignedSource<<52fcc0d5f96daffa1835930798c5bdb3>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type EvaluatorKind = "BUILTIN" | "CODE" | "DECISION" | "LLM";
export type projectEvaluatorOptionsQuery$variables = Record<PropertyKey, never>;
export type projectEvaluatorOptionsQuery$data = {
  readonly evaluators: {
    readonly edges: ReadonlyArray<{
      readonly evaluator: {
        readonly __typename: string;
        readonly datasets: {
          readonly edges: ReadonlyArray<{
            readonly dataset: {
              readonly id: string;
            };
          }>;
        };
        readonly description: string | null;
        readonly id: string;
        readonly kind: EvaluatorKind;
        readonly name: string;
        readonly projects: {
          readonly edges: ReadonlyArray<{
            readonly project: {
              readonly id: string;
              readonly name: string;
            };
          }>;
        };
      };
    }>;
    readonly pageInfo: {
      readonly hasNextPage: boolean;
    };
  };
};
export type projectEvaluatorOptionsQuery = {
  response: projectEvaluatorOptionsQuery$data;
  variables: projectEvaluatorOptionsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 100
      },
      {
        "kind": "Literal",
        "name": "sort",
        "value": {
          "col": "updatedAt",
          "dir": "desc"
        }
      }
    ],
    "concreteType": "EvaluatorConnection",
    "kind": "LinkedField",
    "name": "evaluators",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "EvaluatorEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": "evaluator",
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              (v0/*:: as any*/),
              (v1/*:: as any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "kind",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ProjectConnection",
                "kind": "LinkedField",
                "name": "projects",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ProjectEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": "project",
                        "args": null,
                        "concreteType": "Project",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v0/*:: as any*/),
                          (v1/*:: as any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "DatasetConnection",
                "kind": "LinkedField",
                "name": "datasets",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "DatasetEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": "dataset",
                        "args": null,
                        "concreteType": "Dataset",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v0/*:: as any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "PageInfo",
        "kind": "LinkedField",
        "name": "pageInfo",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "hasNextPage",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "evaluators(first:100,sort:{\"col\":\"updatedAt\",\"dir\":\"desc\"})"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "projectEvaluatorOptionsQuery",
    "selections": (v2/*:: as any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "projectEvaluatorOptionsQuery",
    "selections": (v2/*:: as any*/)
  },
  "params": {
    "cacheID": "d920537f56775496d759b2e618ecdc82",
    "id": null,
    "metadata": {},
    "name": "projectEvaluatorOptionsQuery",
    "operationKind": "query",
    "text": "query projectEvaluatorOptionsQuery {\n  evaluators(first: 100, sort: {col: updatedAt, dir: desc}) {\n    edges {\n      evaluator: node {\n        __typename\n        id\n        name\n        description\n        kind\n        projects {\n          edges {\n            project: node {\n              id\n              name\n            }\n          }\n        }\n        datasets {\n          edges {\n            dataset: node {\n              id\n            }\n          }\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d8f3b1b505ffd75ffe749f862c0e17b3";

export default node;
