import { Module } from "@nestjs/common";
import { InventoryController } from "./controllers/inventory";
import { InventoryService } from "./services/inventory";

@Module({
  imports: [],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class AppModule {}
