import { Injectable } from "@nestjs/common";
import { AwsDynamoService } from "./aws-dynamo";
import { AwsSqsService } from "./aws-sqs";
import { FarmersMarketService } from "./farmers-market";

@Injectable()
export class InventoryService {

  constructor(
    private readonly awsSqsService: AwsSqsService,
    private readonly awsDynamoService: AwsDynamoService,
    private readonly farmersMarketService: FarmersMarketService,
  ) {}

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
          // enviamos un mensaje una nueva orden a warehouse
          await this.awsSqsService.sendMessage(message, "request");
        }
      } else {
        // order is ready for kitchen
        READY = true;
      }
      if (READY) {
        await this.awsSqsService.sendMessage({
          orderId,
          status: "INGREDIENTS_READY",
        }, "response");
      }
    }
  }
}
