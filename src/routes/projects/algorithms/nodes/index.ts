import { rootHypoNaNode } from "./hyponatremia";
import { KRootNode } from "./potassium";

export interface Plan {
  Impression?: string[],
  Actions?: string[],
}
export interface DecisionNode {
  question?: string;
  info?: string;
  branches?: { [key: string]: DecisionNode };
  action?: string;
  plan?: Plan
}

export const rootNodes = [KRootNode, rootHypoNaNode]
