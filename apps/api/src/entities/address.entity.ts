import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('addresses')
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CustomerEntity, { nullable: false })
  customer!: CustomerEntity;

  @Column()
  line1!: string;

  @Column({ nullable: true })
  line2?: string;

  @Column()
  city!: string;

  @Column()
  province!: string;

  @Column()
  country!: string;

  @Column({ nullable: true })
  postalCode?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


