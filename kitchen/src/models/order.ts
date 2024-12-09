import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Recipe } from "./recipe";
import { OrderStatusEnum } from "./enums/order";

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

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatusEnum)),
    allowNull: false,
    defaultValue: OrderStatusEnum.PENDING,
  })
  status: OrderStatusEnum;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: "created_at",
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "finished_at",
  })
  finishedAt: Date;


  @BelongsTo(() => Recipe)
  recipe: Recipe;
}


