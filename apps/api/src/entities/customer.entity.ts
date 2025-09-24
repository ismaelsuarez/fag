import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity | null;

  @Column()
  fullName!: string;

  @Column({ nullable: true })
  documentId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


