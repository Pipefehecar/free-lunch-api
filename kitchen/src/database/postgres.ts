import { Module } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Order } from '../models/order';
import { Recipe } from '../models/recipe';
import { RecipeIngredient } from '../models/recipe-ingredient';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ingredient } from 'src/models/ingredient';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('postgres.host'),
        port: configService.get('postgres.port'),
        username: configService.get('postgres.username'),
        password: configService.get('postgres.password'),
        database: configService.get('postgres.database'),
        models: [Recipe, RecipeIngredient, Order, Ingredient],
        autoLoadModels: true,
        synchronize: true,
        sync: {
          alter: true, 
        },
        logging: false,
      }),
    }),
    SequelizeModule.forFeature([Recipe, RecipeIngredient, Order, Ingredient]), // Agregar esto aquí también
  ],
  exports: [SequelizeModule], // Importante: exportar SequelizeModule
})
export class DatabaseModule {}