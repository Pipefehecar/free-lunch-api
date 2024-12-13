import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IngredientUnitEnum } from "../models/enums/ingredient";
import { Ingredient } from "../models/ingredient";
import { Recipe } from "../models/recipe";
import { RecipeIngredient } from "../models/recipe-ingredient";

@Injectable()
export class RecipeRepository {
  constructor(
    @InjectModel(Recipe) private recipeModel: typeof Recipe,
    @InjectModel(RecipeIngredient)
    private recipeIngredientModel: typeof RecipeIngredient,
    @InjectModel(Ingredient) private ingredientModel: typeof Ingredient
  ) {}

  async findAll(): Promise<Recipe[]> {
    const recipes = await this.recipeModel.findAll({
      include: [
        {
          model: Ingredient,
          through: {
            attributes: ["quantity", "unit"],
          },
          attributes: ["id", "name"],
        },
      ],
      attributes: ["id", "name"],
      nest: true,
    });
    return recipes;
  }

  async findById(id: number): Promise<Recipe | null> {
    return await this.recipeModel.findByPk(id, {
      include: [Ingredient],
    });
  }

  async findRandomRecipeId(): Promise<any> {
    const count = await this.recipeModel.count();

    if (count === 0) {
      throw new Error("No recipes found in the database");
    }

    const randomIndex = Math.floor(Math.random() * count);

    const recipe = await this.recipeModel.findOne({
      offset: randomIndex,
    });

    if (!recipe) {
      throw new Error("No recipe found at the random index");
    }

    const ingredients = await this.recipeIngredientModel.findAll({
      where: { recipeId: recipe.id },
      attributes: ["ingredientId", "quantity"],
      raw: true, 
    });

    const requiredIngredients = ingredients.map((item) => ({
      id: item.ingredientId,
      quantity: item.quantity,
    }));


    return { recipeId: recipe.id, ingredients: requiredIngredients };
  }

  async create(
    name: string,
    ingredients: Array<{
      ingredient: string;
      quantity: number;
      unit: IngredientUnitEnum;
    }>
  ): Promise<Recipe> {
    // Usar transacción para asegurar que se guarden tanto la receta como sus ingredientes
    return await this.recipeModel.sequelize!.transaction(async (t) => {
      const recipe = await this.recipeModel.create(
        { name },
        { transaction: t }
      );

      const recipeIngredients = ingredients.map((ing) => ({
        recipeId: recipe.id,
        ingredient: ing.ingredient,
        quantity: ing.quantity,
        unit: ing.unit,
      }));

      await this.recipeIngredientModel.bulkCreate(recipeIngredients, {
        transaction: t,
      });

      return recipe;
    });
  }
}
