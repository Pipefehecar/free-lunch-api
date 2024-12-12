interface PurchaseItem {
  id: { S: string };
  name: { S: string };
  quantity: { N: string };
}

interface InventoryItem {
  id: { S: string };
  name: { S: string };
  stock: { N: string };
}
