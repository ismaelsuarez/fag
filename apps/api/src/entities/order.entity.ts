import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { OrderItemEntity } from './order_item.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CustomerEntity, { nullable: true })
  customer?: CustomerEntity | null;

  @Column({ default: 'pending' })
  status!: 'pending' | 'paid' | 'shipped' | 'cancelled';

  @Column('numeric', { default: 0 })
  totalAmount!: string;

  @OneToMany(() => OrderItemEntity, (i) => i.order, { cascade: true })
  items!: OrderItemEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


