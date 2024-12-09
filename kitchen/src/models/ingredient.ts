import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { Recipe } from "./recipe";
import { RecipeIngredient } from "./recipe-ingredient";

@Table({tableName: "ingredients"})
export class Ingredient extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
  })
  name: string;

  @BelongsToMany(() => Recipe, () => RecipeIngredient)
  recipes: Recipe[];
}
