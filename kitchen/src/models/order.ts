import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { OrderStatusEnum } from "./enums/order";
import { KitchenRequest } from "./kitchen-request";
import { Recipe } from "./recipe";

@Table({ tableName: "orders" })
export class Order extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Recipe)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  recipeId: number;

  @ForeignKey(() => KitchenRequest)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: KitchenRequest,
      key: "id",
    },
  })
  requestId: number;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatusEnum)),
    allowNull: false,
    defaultValue: OrderStatusEnum.CREATED,
  })
  status: OrderStatusEnum;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "finished_at",
  })
  finishedAt: Date;

  @BelongsTo(() => Recipe)
  recipe: Recipe;

  @BelongsTo(() => KitchenRequest)
  request: KitchenRequest;
}
