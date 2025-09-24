import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProductVariantEntity } from './product_variant.entity';

@Entity('prices')
export class PriceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ProductVariantEntity, { nullable: false })
  variant!: ProductVariantEntity;

  @Column('numeric')
  amount!: string;

  @Column({ default: 'ARS' })
  currency!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


