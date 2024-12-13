import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Ingredient } from "../models/ingredient";
import { KitchenRequest } from "../models/kitchen-request";
import { Order } from "../models/order";
import { Recipe } from "../models/recipe";
import { RecipeIngredient } from "../models/recipe-ingredient";

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: "postgres",
        host: configService.get("postgres.host"),
        port: configService.get("postgres.port"),
        username: configService.get("postgres.username"),
        password: configService.get("postgres.password"),
        database: configService.get("postgres.database"),
        models: [Recipe, RecipeIngredient, Ingredient, KitchenRequest, Order],
        autoLoadModels: true,
        synchronize: true,
        dialectOptions: {
          ssl: {
            require: false,
            rejectUnauthorized: false,
          },
        },
        sync: {
          alter: true,
        },
        logging: false,
      }),
    }),
    SequelizeModule.forFeature([
      Recipe,
      RecipeIngredient,
      Ingredient,
      KitchenRequest,
      Order,
    ]), 
  ],
  exports: [SequelizeModule], 
})
export class DatabaseModule {}
