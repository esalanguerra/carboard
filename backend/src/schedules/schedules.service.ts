import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createScheduleDto: CreateScheduleDto) {
    return await this.prismaService.schedule.create({
      data: createScheduleDto,
    });
  }

  async findAll() {
    return await this.prismaService.schedule.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.schedule.findUnique({
      where: { id },
      include: { templateMessage: true, messages: true },
    });
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    return await this.prismaService.schedule.update({
      where: { id },
      data: updateScheduleDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.schedule.delete({
      where: { id },
    });
  }
}
