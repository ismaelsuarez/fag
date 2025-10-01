import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ErpSku } from './erp_sku.entity';

@Entity('erp_branch_stock')
export class ErpBranchStock {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ErpSku, { nullable: false })
  sku!: ErpSku;

  @Column()
  branchId!: string;

  @Column('numeric', { transformer: { to: (v: number) => v, from: (v: string) => Number(v) } })
  price!: number;

  @Column({ default: 'ARS' })
  currency!: string;

  @Column('int', { default: 0 })
  stock!: number;

  @Column('int', { default: 0 })
  stockReserved!: number;

  // stockReal = stock - stockReserved (puede ser virtual en consultas)
}


