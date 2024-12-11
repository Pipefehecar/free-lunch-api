import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AwsDynamoService } from "./aws-dynamo";
import { AwsSqsService } from "./aws-sqs";
import { FarmersMarketService } from "./farmers-market";

@Injectable()
export class InventoryService {
  private responseQueueUrl: string;

  constructor(
    private readonly awsSqsService: AwsSqsService,
    private readonly awsDynamoService: AwsDynamoService,
    private readonly farmersMarketService: FarmersMarketService,
    private configService: ConfigService
  ) {
    const queueUrl = this.configService.get<string>("aws.sqs.responseQueueUrl");
    if (!queueUrl) {
      throw new Error(
        "SQS_RESPONSE_QUEUE_URL is not defined in environment variables"
      );
    }
    this.responseQueueUrl = queueUrl;
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
    // Aquí podrías usar awsDynamoService.getPurchaseHistory()
    return await this.awsDynamoService.getPurchaseHistory();
  }

  async processIngredientsRequest(message: any) {
    console.log("Processing ingredients request:", message);
    const { orderId, ingredients } = message;
    // consulto a la tabla de inventario si el listado de ids de ingredientes estan disponibles
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
          await this.awsSqsService.sendMessage(this.responseQueueUrl, message);
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
