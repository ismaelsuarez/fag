import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ErpSku } from './erp_sku.entity';
import { ErpProductImage } from './erp_product_image.entity';

@Entity('erp_products')
export class ErpProduct {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  externalId!: string; // ID ERP

  @Column({ nullable: true })
  name!: string | null;

  @Column({ nullable: true })
  brand!: string | null;

  @Column({ nullable: true })
  category!: string | null;

  @Column({ default: false })
  isPrescription!: boolean;

  @OneToMany(() => ErpSku, (s) => s.product)
  skus!: ErpSku[];

  @OneToMany(() => ErpProductImage, (i) => i.product)
  images!: ErpProductImage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


