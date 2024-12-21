import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchCarsService } from './search-cars.service';
import { CarsService } from 'src/cars/cars.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PrismaService, SearchCarsService, CarsService, MessagesService],
})
export class TasksModule {}
