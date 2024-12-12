import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AwsDynamoService } from "./aws-dynamo";
import { AwsSqsService } from "./aws-sqs";
import { FarmersMarketService } from "./farmers-market";

@Injectable()
export class InventoryService {
  private responseQueueUrl: string;
  private requestQueueUrl: string;

  constructor(
    private readonly awsSqsService: AwsSqsService,
    private readonly awsDynamoService: AwsDynamoService,
    private readonly farmersMarketService: FarmersMarketService,
    private configService: ConfigService
  ) {
    const responseQueue = this.configService.get<string>("aws.sqs.responseQueueUrl");
    const requestQueue = this.configService.get<string>("aws.sqs.requestQueueUrl");
    if (!responseQueue || !requestQueue) {
      throw new Error(
        "QUEUE_URL is not defined in environment variables"
      );
    }
    this.responseQueueUrl = responseQueue;
    this.requestQueueUrl = requestQueue;
  }

  async getInventory() {
    try {
      return await this.awsDynamoService.getInventoryAll();
    } catch (error) {
      console.error("Error getting inventory:", error);
      throw error;
    }
  }

  async getPurchases() {
    try {
      return await this.awsDynamoService.getPurchaseHistory();
    } catch (error) {
      console.error("Error getting purchase history:", error);
      throw error;
    }
  }

  async processIngredientsRequest(message: any) {
    console.log("Processing ingredients request:", message);
    const { orderId, ingredients } = message;
    for (const { id, quantity } of ingredients) {
      const { name, stock } = await this.awsDynamoService.getIngredientById(id);
      let READY = false;
      if (stock < quantity) {
        let NOT_READY = true;
        const quantitySold = await this.farmersMarketService.buyIngredient(
          name
        );
        if (quantitySold > 0) {
          await this.awsDynamoService.makePurchase(id, name, quantitySold);
          await this.awsDynamoService.updateInventory(id, quantitySold);
          NOT_READY = false;
        }
        if (quantitySold + stock >= quantity) {
          //order is ready for kitchen
          READY = true;
          NOT_READY = false;
        }
        if (NOT_READY) {
          // enviamos un mensaje una nueva orden a warehous
          await this.awsSqsService.sendMessage(this.requestQueueUrl, message);
        }
      } else {
        // order is ready for kitchen
        READY = true;
      }
      if (READY) {
        await this.awsSqsService.sendMessage(this.responseQueueUrl, {
          orderId,
          status: "INGREDIENTS_READY",
        });
      }
    }
  }
}
