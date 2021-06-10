export interface Item {
  weight: number;
  value: number;
  inKnapsack?: boolean;
  score?: number;
}

export interface Knapsack {
  capacity: number;
  index: number;
}
