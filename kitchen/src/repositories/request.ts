import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { KitchenRequest } from "../models/kitchen-request";

@Injectable()
export class RequestRepository {
  constructor(
    @InjectModel(KitchenRequest) private requestModel: typeof KitchenRequest
  ) {}

  async create(notes: string) {
    return await this.requestModel.create({ notes });
  }

  async getAll() {
    return await this.requestModel.findAll();
  }
}
