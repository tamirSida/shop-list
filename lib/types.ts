export interface GroceryItem {
  id: string;
  name: string;
  amount: string | null;
  category: string;
  bought: boolean;
  createdAt: number;
}

export const CATEGORIES = ["super", "pharm", "food", "snacks", "other"] as const;
export type Category = (typeof CATEGORIES)[number];
