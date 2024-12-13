import { Injectable } from "@nestjs/common";
import { RequestRepository } from "../repositories/request";

@Injectable()
export class RequestService {
  constructor(private readonly requestRepository: RequestRepository) {}

  async create(notes: string) {
    return await this.requestRepository.create(notes);
  }

  async getAll() {
    return await this.requestRepository.getAll();
  }
}
