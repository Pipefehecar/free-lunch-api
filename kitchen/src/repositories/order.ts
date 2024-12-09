import { Injectable } from "@nestjs/common";
import { OrderStatusEnum } from "../models/enums/order";
import { Order } from "../models/order";
import { Recipe } from "../models/recipe";

@Injectable()
export class OrderRepository {
  async create(recipeId: number, requestId: number): Promise<Order> {
    return await Order.create({
      recipeId,
      requestId,
    });
  }

  async createMassive(recipeIds: number[]): Promise<Order[]> {
    return await Order.bulkCreate(
      recipeIds.map((recipeId) => ({
        recipeId,
      }))
    );
  }

  async findAll(): Promise<Order[]> {
    return await Order.findAll({
      include: [
        {
          model: Recipe,
        },
      ],
    });
  }

  async findById(id: string): Promise<Order | null> {
    return await Order.findByPk(id, {
      include: [
        {
          model: Recipe,
        },
      ],
    });
  }

  async updateStatus(
    id: string,
    status: OrderStatusEnum
  ): Promise<[number, Order[]]> {
    return await Order.update(
      {
        status,
        ...(status === OrderStatusEnum.READY ? { finishedAt: new Date() } : {}),
      },
      {
        where: { id },
        returning: true,
      }
    );
  }

  async findByStatus(status: OrderStatusEnum): Promise<Order[]> {
    return await Order.findAll({
      where: { status },
    });
  }
}
