import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RecipesController } from '../../src/controllers/recipes';
import { RecipesService } from '../../src/services/recipes';

describe('RecipesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockRecipes = [
      { id: 1, name: 'Pasta' },
      { id: 2, name: 'Pizza' },
    ];

    const moduleFixture: TestingModule = await Test.createTestingModule({
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

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/recipes (GET) should return all recipes', async () => {
    const response = await request(app.getHttpServer()).get('/recipes');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'Pasta' },
      { id: 2, name: 'Pizza' },
    ]);
  });
});
