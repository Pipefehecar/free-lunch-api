import { Injectable } from "@nestjs/common";
import { OrderStatusEnum } from "../models/enums/order";
import { OrderRepository } from "../repositories/order";
import { RecipeRepository } from "../repositories/recipe";
import { AwsSqsService } from "./aws-sqs";

@Injectable()
export class OrdersService {

  constructor(
    private orderRepository: OrderRepository,
    private recipeRepository: RecipeRepository,
    private readonly awsSqsService: AwsSqsService,
  ) {}

  async createOrders(count: number, requestId: number) {
    const orders = [];
  
    for (let i = 0; i < count; i++) {
      const {recipeId, ingredients} = await this.recipeRepository.findRandomRecipeId();
      const { id: orderId } = await this.orderRepository.create(
        recipeId,
        requestId
      );
      orders.push(orderId);
      console.log("createOrders - Ingredients:", ingredients);
      console.log("createOrders - Order created with id:", orderId);
      
      await this.sendIngredientsRequest(orderId, ingredients);
    }
    
    console.log("Orders created with ids:", orders);
    return { orders_created: orders.length, status: "CREATED" };
  }

  async sendIngredientsRequest(orderId: string, ingredients: any) {
    try {
      const response = await this.awsSqsService.sendMessage({
        orderId: orderId,
        ingredients: ingredients,
        action: "REQUEST_INGREDIENTS",
      });

      console.log("SQS Message Sent Successfully:", response);
      if (response?.MessageId) {
        console.log("MessageId:", response.MessageId);
      }
    } catch (error) {
      console.error("Error sending SQS message:", error);
    }
  }



  async getAllOrders() {
    return await this.orderRepository.findAll();
  }

  async getOrderById(id: string) {
    return await this.orderRepository.findById(id);
  }

  async getOrdersByStatus(status: OrderStatusEnum) {
    return await this.orderRepository.findByStatus(status);
  }

  async processIngredientsRequest(message: any) {
    console.log("sqs message response recived from warehouse:", message);
    const { orderId, ingredientsReady } = message;
    await this.orderRepository.updateStatus(
      orderId,
      OrderStatusEnum.IN_PROGRESS
    );
    setTimeout(() => {
      console.log("Se esta preparando la orden con id:", orderId);
    }, 30000); 
    console.log("Processing ingredients response:", ingredientsReady);
    console.log("recived order:", orderId);
    await this.orderRepository.updateStatus(orderId, OrderStatusEnum.READY);
  }
}
