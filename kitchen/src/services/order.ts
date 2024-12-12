import { Injectable } from "@nestjs/common";
import { OrderStatusEnum } from "../models/enums/order";
import { OrderRepository } from "../repositories/order";
import { RecipeRepository } from "../repositories/recipe";
import { AwsSqsService } from "./aws-sqs";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class OrdersService {
  private responseQueueUrl: string;
  private requestQueueUrl: string;

  constructor(
    private orderRepository: OrderRepository,
    private recipeRepository: RecipeRepository,
    private readonly awsSqsService: AwsSqsService,
    private configService: ConfigService
  ) {
    const responseQueue = this.configService.get<string>(
      "aws.sqs.responseQueueUrl"
    );
    const requestQueue = this.configService.get<string>(
      "aws.sqs.requestQueueUrl"
    );
    if (!responseQueue || !requestQueue) {
      throw new Error("QUEUE_URL is not defined in environment variables");
    }
    this.responseQueueUrl = responseQueue;
    this.requestQueueUrl = requestQueue;
  }

  async createOrders(count: number, requestId: number) {
    const orders = [];
  
    for (let i = 0; i < count; i++) {
      const {recipeId, ingredients} = await this.recipeRepository.findRandomRecipeId();
      const { id: orderId } = await this.orderRepository.create(
        recipeId,
        requestId
      );
      orders.push(orderId);
      await this.awsSqsService.sendMessage({
        orderId: orderId,
        ingredients: ingredients,
        action: "REQUEST_INGREDIENTS",
      });
    }
    
    console.log("Orders created with ids:", orders);
    return { orders_created: orders.length, status: "CREATED" };
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

  // recibimos un mensaje de la bodega y lo procesamos
  async processIngredientsRequest(message: any) {
    console.log("Processing ingredients request:", message);
    const { orderId, ingredientsReady } = message;
    await this.orderRepository.updateStatus(
      orderId,
      OrderStatusEnum.IN_PROGRESS
    );
    console.log("Processing ingredients request:", ingredientsReady);
    console.log("Created order:", orderId);
    await this.orderRepository.updateStatus(orderId, OrderStatusEnum.READY);
  }
}
