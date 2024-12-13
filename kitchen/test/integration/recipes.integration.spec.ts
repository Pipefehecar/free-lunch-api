import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from '../../src/controllers/recipes';
import { RecipesService } from '../../src/services/recipes';

describe('Recipes Integration', () => {
  let controller: RecipesController;
  let service: RecipesService;

  beforeEach(async () => {
    const mockRecipes = [
      { id: 1, name: 'Pasta' },
      { id: 2, name: 'Pizza' },
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockRecipes),
          },
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    service = module.get<RecipesService>(RecipesService);
  });

  it('should fetch all recipes from the service', async () => {
    const recipes = await controller.getRecipes();
    expect(recipes).toEqual([
      { id: 1, name: 'Pasta' },
      { id: 2, name: 'Pizza' },
    ]); // Verifica el resultado esperado
  });

  it('should call the service method findAll once', async () => {
    await controller.getRecipes();
    expect(service.findAll).toHaveBeenCalledTimes(1); // Verifica que se llama exactamente una vez
  });
});
