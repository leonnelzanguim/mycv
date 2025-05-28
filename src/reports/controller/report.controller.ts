import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { CreateReportDto } from '../dtos/create-report.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { ReportDto } from '../dtos/report.dto';
import { ApproveReportDto } from '../dtos/approve-report.dto';
import { GetEstimateDto } from '../dtos/get-estimate.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(
    @Body() body: CreateReportDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.create(body, currentUser);
  }

  @Patch('/:id')
  @Serialize(ReportDto)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportService.changeApproval(id, body.approved);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportService.createEstimate(query);
  }
}
