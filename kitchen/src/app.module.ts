import { Module } from "@nestjs/common";
import { OrdersController } from "./controllers/order";
import { OrdersService } from "./services/order";

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class AppModule {}
