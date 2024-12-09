import { Injectable } from "@nestjs/common";
import { RecipeIngredient } from "../models/recipe-ingredient";

@Injectable()
export class RecipeIngredientRepository {
  async findByRecipeId(recipeId: number): Promise<RecipeIngredient[]> {
    return await RecipeIngredient.findAll({
      where: { recipeId },
    });
  }

  async updateQuantity(
    recipeId: number,
    ingredient: string,
    quantity: number
  ): Promise<[number, RecipeIngredient[]]> {
    return await RecipeIngredient.update(
      { quantity },
      {
        where: {
          recipeId,
          ingredient,
        },
        returning: true,
      }
    );
  }
}
