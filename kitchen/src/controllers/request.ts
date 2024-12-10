import { RequestService } from "../services/request";

import { Controller, Get } from "@nestjs/common";

@Controller()
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get("requests")
  async getRequests() {
    return await this.requestService.getAll();
  }
}
