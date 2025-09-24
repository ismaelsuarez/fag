import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';

type CartItem = { variantId: string; quantity: number };

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CustomerEntity, { nullable: true })
  customer?: CustomerEntity | null;

  @Column('jsonb', { default: [] })
  items!: CartItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


