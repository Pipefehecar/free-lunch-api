
import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from '../../../src/services/recipes';
import { RecipeRepository } from '../../../src/repositories/recipe';

describe('RecipesService', () => {
  let service: RecipesService;
  let repository: RecipeRepository;

  beforeEach(async () => {
    const mockRecipeRepository = {
      findAll: jest.fn().mockResolvedValue([
        { id: 1, name: 'Pasta' },
        { id: 2, name: 'Pizza' },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: RecipeRepository, useValue: mockRecipeRepository },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    repository = module.get<RecipeRepository>(RecipeRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call recipeRepository.findAll and return all recipes', async () => {
    const recipes = await service.findAll();
    expect(repository.findAll).toHaveBeenCalled();
    expect(recipes).toEqual([
      { id: 1, name: 'Pasta' },
      { id: 2, name: 'Pizza' },
    ]);
  });
});
