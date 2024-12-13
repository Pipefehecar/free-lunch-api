import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Recipe } from "./recipe";
import { Ingredient } from "./ingredient";
import { IngredientUnitEnum } from "./enums/ingredient";

@Table({
  tableName: "recipe_ingredients",
  timestamps: false,
})
export class RecipeIngredient extends Model {

  @ForeignKey(() => Recipe)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Recipe,
      key: 'id',
    },
  })
  recipeId: number;

  @ForeignKey(() => Ingredient)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Ingredient,
      key: 'id',
    },
  })
  ingredientId: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;
  @Column({
    type: DataType.ENUM(...Object.values(IngredientUnitEnum)),
    allowNull: false,
  })
  unit: IngredientUnitEnum;

  @BelongsTo(() => Recipe)
  recipe: Recipe;

  @BelongsTo(() => Ingredient)
  ingredient: Ingredient;
}
