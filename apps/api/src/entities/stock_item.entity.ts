import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BranchEntity } from './branch.entity';
import { ProductVariantEntity } from './product_variant.entity';

@Entity('stock_items')
export class StockItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => BranchEntity, { nullable: false })
  branch!: BranchEntity;

  @ManyToOne(() => ProductVariantEntity, { nullable: false })
  variant!: ProductVariantEntity;

  @Column('int')
  quantity!: number;
}


