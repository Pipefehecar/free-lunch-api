import { Injectable } from "@nestjs/common";

@Injectable()
export class OrdersService {
  async createOrder() {
    // Aquí iría la lógica para insertar en Postgres, generar correlationId, enviar a SQS la solicitud a Bodega, etc.
    // Por ahora, retornamos un mock
    return { orderId: "mock-order-id", status: "CREATED" };
  }

  async getOrders() {
    // Aquí harías un SELECT en Postgres
    return [{ orderId: "mock-order-id", status: "PENDING" }];
  }
}
