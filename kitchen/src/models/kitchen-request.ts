import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";

import { Order } from "./order";

@Table({ tableName: "requests" })
export class KitchenRequest extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  notes?: string;

  @HasMany(() => Order)
  orders: Order[];
}
