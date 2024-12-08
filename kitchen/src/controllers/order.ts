import { Controller, Get, Post } from "@nestjs/common";
import { OrdersService } from "../services/order";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder() {
    // Lógica sencilla (aquí luego colocarás la lógica de crear orden en la BD y enviar mensaje SQS)
    // Por ahora retornamos algo fijo
    return await this.ordersService.createOrder();
  }

  @Get()
  async getOrders() {
    return await this.ordersService.getOrders();
  }
}
