import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { Ingredient } from "./ingredient";
import { RecipeIngredient } from "./recipe-ingredient";

@Table({tableName: "recipes"})
export class Recipe extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @BelongsToMany(() => Ingredient, () => RecipeIngredient)
  ingredients: Ingredient[];
}
