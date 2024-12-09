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

  async createOrder() {
    const recipeId = await this.recipeRepository.findRandomRecipeId();
    const { id: orderId } = await this.orderRepository.create(recipeId);

    console.log("Order created with id:", orderId);

    await this.sqsService.sendMessage({
      orderId: orderId,
      action: "REQUEST_INGREDIENTS",
    });

    return { orderId: orderId, status: "CREATED" };
  }

  async createMassiveOrders(count: number) {
    // 1. select random recipeId from recipes table
    for (let i = 0; i < count; i++) {
      const recipeId = await this.recipeRepository.findRandomRecipeId();
      const { id: orderId } = await this.orderRepository.create(recipeId);
      console.log("Order created with id:", orderId);
      await this.sqsService.sendMessage({
        orderId: orderId,
        action: "REQUEST_INGREDIENTS",
      });
    }
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
