import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductVariantEntity } from './product_variant.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OrderEntity, (o) => o.items, { nullable: false })
  order!: OrderEntity;

  @ManyToOne(() => ProductVariantEntity, { nullable: false })
  variant!: ProductVariantEntity;

  @Column('int')
  quantity!: number;

  @Column('numeric')
  unitPrice!: string;
}


