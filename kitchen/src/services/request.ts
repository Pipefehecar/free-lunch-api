import { Injectable } from "@nestjs/common";
import { RequestRepository } from "../repositories/request";

@Injectable()
export class RequestService {
  constructor(private readonly requestRepository: RequestRepository) {}

  async create(notes: string) {
    return await this.requestRepository.create(notes);
  }

  async getAll() {
    //traemos las ordenes incluidas las ordenes y los nombres de las recetas
    return await this.requestRepository.getAll();
  }
}
