import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { OrdersService } from "../services/order";
import { RequestService } from "../services/request";
import { OrderStatusQueryDto } from "../dtos/order-status";

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly requestService: RequestService
  ) {}

  @Post("orders")
  async createMassiveOrders(
    @Body("quantity") quantity: number,
    @Body("notes") notes: string
  ) {
    const request = await this.requestService.create(notes);
    return await this.ordersService.createOrders(quantity, request.id);
  }

  @Get("orders/:id")
  async getOrderById(@Param("id") id: string) {
    return await this.ordersService.getOrderById(id);
  }
  @Get("orders")
  async getOrdersByStatus(@Query() query: OrderStatusQueryDto) {
    return await this.ordersService.getOrdersByStatus(query.status);
  }
}
