import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from '../../../src/controllers/recipes';
import { RecipesService } from '../../../src/services/recipes';

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: RecipesService;

  beforeEach(async () => {
    const mockRecipesService = {
      findAll: jest.fn().mockResolvedValue([
        { id: 1, name: 'Pasta' },
        { id: 2, name: 'Pizza' },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService,
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call RecipesService.findAll and return recipes', async () => {
    const recipes = await controller.getRecipes();
    expect(service.findAll).toHaveBeenCalled(); // Verifica que se llame al método del servicio
    expect(recipes).toEqual([
      { id: 1, name: 'Pasta' },
      { id: 2, name: 'Pizza' },
    ]); // Verifica el resultado esperado
  });
});
