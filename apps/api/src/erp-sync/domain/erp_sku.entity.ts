import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ErpProduct } from './erp_product.entity';

@Entity('erp_skus')
export class ErpSku {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ErpProduct, (p) => p.skus, { nullable: false })
  product!: ErpProduct;

  @Column({ type: 'varchar', unique: true })
  externalId!: string; // ID ERP

  @Column({ type: 'varchar', nullable: true })
  code!: string | null;

  @Column({ type: 'varchar', nullable: true })
  barcode!: string | null;

  @Column({ type: 'varchar', nullable: true })
  presentation!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


