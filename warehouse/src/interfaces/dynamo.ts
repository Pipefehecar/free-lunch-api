interface PurchaseItem {
  id: { N: string };
  name: { S: string };
  quantity: { N: string };
}

interface InventoryItem {
  id: { N: string };
  name: { S: string };
  stock: { N: string };
}
