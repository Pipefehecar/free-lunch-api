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
    const randomIndex = Math.floor(Math.random() * count);
    const recipe = await this.recipeModel.findOne({
      offset: randomIndex,
    });
    const requiredIngredients = await this.recipeIngredientModel.findAll({
      where: {recipeId: recipe?.id },
      attributes: ["IngredientId", "quantity"],
      nest: true,
    });
    return [recipe?.id, requiredIngredients];
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
