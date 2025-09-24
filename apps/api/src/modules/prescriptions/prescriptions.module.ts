import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionEntity } from '../../entities/prescription.entity';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([PrescriptionEntity])],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService]
})
export class PrescriptionsModule {}


