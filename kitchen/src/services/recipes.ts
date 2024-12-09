import { RecipeRepository } from "../repositories/recipe";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RecipesService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async findAll() {
    return await this.recipeRepository.findAll();
  }
}
