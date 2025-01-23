import { KRootNode } from "./potassium";

export interface DecisionNode {
  question?: string;
  info: string;
  branches?: { [key: string]: DecisionNode };
  action?: string;
}

export const rootNodes = [KRootNode]
