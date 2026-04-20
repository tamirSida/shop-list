export interface PartyItem {
  id: string;
  name: string;
  amount: string | null;
  bought: boolean;
  price: number | null;
  buyer: string | null;
  boughtAt: number | null;
  createdAt: number;
}

export interface Buyer {
  id: string;
  name: string;
  createdAt: number;
}
