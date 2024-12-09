import { Module } from "@nestjs/common";
import { configuration } from "./config/configuration";
import { OrdersController } from "./controllers/order";
import { DatabaseModule } from "./database/postgres";
import { OrderRepository } from "./repositories/order";
import { RecipeRepository } from "./repositories/recipe";
import { RecipeIngredientRepository } from "./repositories/recipe-ingredient";
import { AwsSqsService } from "./services/aws-sqs";
import { OrdersService } from "./services/order";
import { ConfigModule } from "@nestjs/config";
import { RecipesService } from "./services/recipes";
import { RecipesController } from "./controllers/recipes";
import { RequestController } from "./controllers/request";
import { RequestService } from "./services/request";
import { RequestRepository } from "./repositories/request";

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [OrdersController, RecipesController, RequestController],
  providers: [
    OrdersService,
    RecipesService,
    RequestService,
    OrderRepository,
    RecipeRepository,
    RequestRepository,
    RecipeIngredientRepository,
    AwsSqsService,
  ],
})
export class AppModule {}
