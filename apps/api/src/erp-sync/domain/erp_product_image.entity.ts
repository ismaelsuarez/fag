import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ErpProduct } from './erp_product.entity';

@Entity('erp_product_images')
export class ErpProductImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ErpProduct, (p) => p.images, { nullable: false })
  product!: ErpProduct;

  @Column()
  url!: string;

  @Column({ default: false })
  isThumbnail!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


