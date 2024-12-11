import { Module } from "@nestjs/common";
import { InventoryController } from "./controllers/inventory";
import { AwsDynamoService } from "./services/aws-dynamo";
import { AwsSqsService } from "./services/aws-sqs";
import { InventoryService } from "./services/inventory";
import { configuration } from "./config/configuration";
import { ConfigModule } from "@nestjs/config";
import { FarmersMarketService } from "./services/farmers-market";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  })],
  controllers: [InventoryController],
  providers: [InventoryService, AwsSqsService, AwsDynamoService, FarmersMarketService],
})
export class AppModule {}
