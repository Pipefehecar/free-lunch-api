import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { KitchenRequest } from "../models/kitchen-request";
import { Recipe } from "src/models/recipe";
import { Order } from "src/models/order";

@Injectable()
export class RequestRepository {
  constructor(
    @InjectModel(KitchenRequest) private requestModel: typeof KitchenRequest
  ) {}

  async create(notes: string) {
    return await this.requestModel.create({ notes });
  }
  // agregamos el include para traer las ordenes y las recetas y el nombre de la receta
  async getAll() {
    return await this.requestModel.findAll({
      include: [
        {
          model: Order,
          attributes: ["id", "status"],
          include: [{ model: Recipe, attributes: ["name"] }],
        },
      ],
    });
  }
}
