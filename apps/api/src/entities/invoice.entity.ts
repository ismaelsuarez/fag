import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('invoices')
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OrderEntity, { nullable: false })
  order!: OrderEntity;

  @Column({ default: 'afip' })
  provider!: 'afip';

  @Column({ nullable: true })
  cae?: string;

  @Column({ nullable: true })
  externalId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


