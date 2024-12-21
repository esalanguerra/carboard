import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { Schedule, SCHEDULE_STATUS } from '@prisma/client';
import { CarsService } from 'src/cars/cars.service';
import { MessagesService } from 'src/messages/messages.service';

interface IFiltersInterface {
  name?: string;
  year?: number;
  mileage?: number;
  price?: number;
  gearbox?: string;
  transmissionSystem?: string;
  numberOfDoors?: number;
}

@Injectable()
export class SearchCarsService {
  private readonly logger = new Logger(SearchCarsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly carsService: CarsService,
    private readonly messageService: MessagesService,
  ) {}

  @Cron('* * * * * *', {
    name: 'search-cars',
    timeZone: 'America/Sao_Paulo',
  })
  async handleSearch() {
    const schedules = await this.prismaService.schedule.findMany({
      include: {
        templateMessage: true,
        user: true,
      },
    });

    for (const schedule of schedules) {
      if (schedule.status === SCHEDULE_STATUS.ACTIVE) {
        const filtersJson = JSON.stringify(schedule.filters);

        const filters = JSON.parse(filtersJson) as IFiltersInterface;

        await this.getCarFilters(filters, schedule);
      }
    }
  }

  async getCarFilters(filters: IFiltersInterface, schedule: Schedule) {
    const page = 1;
    const perPage = 50;

    this.logger.log(
      `Buscando carros com os filtros: ${JSON.stringify(filters)}`,
    );

    const cars = await this.carsService.findAllFilter(page, perPage, filters);

    for (const car of cars) {
      this.logger.log(`Consultando carro ${car.name}, ID: ${car.id}`);
      if (
        !(await this.prismaService.message.findFirst({
          where: {
            carId: car.id,
            userId: schedule.userId,
          },
        }))
      ) {
        this.logger.log(
          `Enviando mensagem para ${car.seller} pelo telefone ${car.phone} sobre o carro ${car.name}`,
        );
      }

      return;
    }
  }
}
