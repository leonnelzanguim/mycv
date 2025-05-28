import { Module } from '@nestjs/common';
import { ReportService } from './services/report.service';
import { ReportController } from './controller/report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportsModule {}
