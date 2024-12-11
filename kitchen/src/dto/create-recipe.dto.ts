export class CreateRecipeIngredientDto {
  id: number;
  quantity: number;
  unit: string;
}

export class CreateRecipeDto {
  name: string;
  description: string;
  instructions: string;
  ingredients: CreateRecipeIngredientDto[];
} 