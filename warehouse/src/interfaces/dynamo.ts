export interface PurchaseItem {
  id: { S: string };
  name: { S: string };
  quantitySold: { N: Number };
  date: { S: string };
}

export interface InventoryItem {
  id: { S: string };
  name: { S: string };
  stock: { N: Number };
}
