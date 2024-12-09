import { Controller, Get } from "@nestjs/common";
import { RecipesService } from "../services/recipes";

@Controller()
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get("recipes")
  async getRecipes() {
    return await this.recipesService.findAll();
  }
}
