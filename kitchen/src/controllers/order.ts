import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { OrderStatusEnum } from "../models/enums/order";
import { OrdersService } from "../services/order";

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("orders")
  async createOrder() {
    return await this.ordersService.createOrder();
  }

  @Post("orders/massive")
  async createMassiveOrders(@Body("count") count: number) {
    return await this.ordersService.createMassiveOrders(count);
  }

  @Get("orders")
  async getOrders() {
    return await this.ordersService.getAllOrders();
  }

  @Get("orders/:id")
  async getOrderById(@Param("id") id: string) {
    return await this.ordersService.getOrderById(id);
  }
  @Get("orders")
  async getOrdersByStatus(@Query("status") status: OrderStatusEnum) {
    return await this.ordersService.getOrdersByStatus(status);
  }
}
