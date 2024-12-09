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

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [OrdersController, RecipesController],
  providers: [
    OrdersService,
    RecipesService,
    OrderRepository,
    RecipeRepository,
    RecipeIngredientRepository,
    AwsSqsService,
  ],
})
export class AppModule {}
