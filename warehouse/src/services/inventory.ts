import { Injectable } from "@nestjs/common";

@Injectable()
export class InventoryService {
  async getInventory() {
    // Mock: listado ficticio de inventario
    return [
      { ingredient: "tomato", quantity: 10 },
      { ingredient: "meat", quantity: 5 },
    ];
  }

  async getPurchases() {
    // Mock: historial ficticio
    return [
      { ingredient: "tomato", timestamp: "2024-12-07T10:00:00Z", quantity: 5 },
    ];
  }

  async processIngredientsRequest(message: any) {
    // Aquí cuando el Kitchen envíe una solicitud vía SQS, este método:
    // - Verificará inventario (DynamoDB)
    // - Si falta inventario, intenta comprar en el market
    // - Finalmente, envía respuesta SQS a Kitchen
    console.log("Processing ingredients request:", message);

    // Mock: asumimos que siempre hay disponibilidad
    // En el futuro, se enviará un mensaje a la cola de respuesta con correlationId
  }
}
