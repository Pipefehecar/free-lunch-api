import { Injectable } from "@nestjs/common";
import { RecipeRepository } from "../repositories/recipe";
import { Ingredient } from "src/models/ingredient";

@Injectable()
export class RecipesService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async findAll() {
    return await this.recipeRepository.findAll();
}
}
