import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatusEnum } from '../models/enums/order';

export class OrderStatusQueryDto {
  @IsNotEmpty({ message: 'Status no puede estar vacío' })
  @IsEnum(OrderStatusEnum, { message: 'Status debe ser un valor válido' })
  status: OrderStatusEnum;
} 