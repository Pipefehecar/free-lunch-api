import { Injectable } from '@nestjs/common';

@Injectable()
export class FarmersMarketService {
  private readonly baseUrl = 'https://recruitment.alegra.com/api/farmers-market';

  async buyIngredient(ingredientName: string): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/buy/${ingredientName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to buy ingredient: ${response.statusText}`);
      }
      // if daata is unknown, return 0
      const data = await response.json() as { quantitySold: number };
      return data.quantitySold || 0;
    } catch (error) {
      console.error(`Error buying ingredient ${ingredientName}:`, error);
      throw error;
    }
  }
}