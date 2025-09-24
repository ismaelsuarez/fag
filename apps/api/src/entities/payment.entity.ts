import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OrderEntity, { nullable: false })
  order!: OrderEntity;

  @Column({ default: 'mp' })
  provider!: 'mp';

  @Column({ default: 'pending' })
  status!: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  externalId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


