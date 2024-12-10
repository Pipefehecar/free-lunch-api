import { Injectable } from "@nestjs/common";
import { AwsSqsService } from "./aws-sqs";
import { OrderStatusEnum } from "../models/enums/order";
import { OrderRepository } from "../repositories/order";
import { RecipeRepository } from "../repositories/recipe";

@Injectable()
export class OrdersService {
  constructor(
    private orderRepository: OrderRepository,
    private recipeRepository: RecipeRepository,
    private sqsService: AwsSqsService
  ) {}


  async createOrders(count: number, requestId: number) {
    const orders = [];
    for (let i = 0; i < count; i++) {
      const recipeId = await this.recipeRepository.findRandomRecipeId();
      const { id: orderId } = await this.orderRepository.create(
        recipeId,
        requestId
      );
      orders.push(orderId);
      // await this.sqsService.sendMessage({
      //   orderId: orderId,
      //   action: "REQUEST_INGREDIENTS",
      // });
    }
    console.log("Orders created with ids:", orders);
    return { orders_created: orders.length, status: "CREATEDsdsada" };
  }

  async getAllOrders() {
    return await this.orderRepository.findAll();
  }

  async getOrderById(id: string) {
    return await this.orderRepository.findById(id);
  }

  // historical(ready), pending, inProgress orders
  async getOrdersByStatus(status: OrderStatusEnum) {
    return await this.orderRepository.findByStatus(status);
  }
}
