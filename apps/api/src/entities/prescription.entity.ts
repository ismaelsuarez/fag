import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('prescriptions')
export class PrescriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CustomerEntity, { nullable: true })
  customer?: CustomerEntity | null;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ default: 'pending' })
  status!: 'pending' | 'validated' | 'rejected';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


