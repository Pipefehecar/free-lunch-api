import { Body, Controller, Get, Post } from "@nestjs/common";
import { InventoryService } from "../services/inventory";

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get("inventory")
  async getInventory() {
    // Simulación: en el futuro leerás de DynamoDB
    return await this.inventoryService.getInventory();
  }

  @Get("purchases")
  async getPurchases() {
    // Simulación: luego leerás de DynamoDB
    return await this.inventoryService.getPurchases();
  }
  
  @Post("test-sqs")
  async testSqs(@Body() message: any) {
    // Simulación: luego leerás de DynamoDB
    return await this.inventoryService.processIngredientsRequest(message);
  }
}

