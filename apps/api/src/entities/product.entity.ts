import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ProductVariantEntity } from './product_variant.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  rxRequired!: boolean;

  @OneToMany(() => ProductVariantEntity, (v) => v.product, { cascade: true })
  variants!: ProductVariantEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


