import { Body, Controller, Get, Post } from "@nestjs/common";
import { InventoryService } from "../services/inventory";

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get("inventory")
  async getInventory() {
    return await this.inventoryService.getInventory();
  }

  @Get("purchases")
  async getPurchases() {
    return await this.inventoryService.getPurchases();
  }
  
  @Post("test-sqs")
  async testSqs(@Body() message: any) {
    return await this.inventoryService.processIngredientsRequest(message);
  }
}

