import { Module } from '@nestjs/common';
import { Order } from '../models/order';
import { Recipe } from '../models/recipe';
import { RecipeIngredient } from '../models/recipe-ingredient';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ingredient } from '../models/ingredient';
import { KitchenRequest } from '../models/kitchen-request';

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
        ssl: true,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Cambia a `true` si usas un certificado válido
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
    ]), // Agregar esto aquí también
  ],
  exports: [SequelizeModule], // Importante: exportar SequelizeModule
})
export class DatabaseModule {}