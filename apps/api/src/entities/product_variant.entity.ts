import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('product_variants')
export class ProductVariantEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ProductEntity, (p) => p.variants, { nullable: false })
  product!: ProductEntity;

  @Column()
  sku!: string;

  @Column({ nullable: true })
  barcode?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


