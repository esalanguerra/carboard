import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Car } from '@prisma/client';
import { UpdateCarDto } from 'src/cars/dto/update-car.dto';
import { CreateCarDto } from 'src/cars/dto/create-car.dto';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCarDto): Promise<Car> {
    return this.prisma.car.create({ data });
  }

  async findAllFilter(
    page: number,
    perPage: number,
    filters: {
      name?: string;
      year?: number;
      mileage?: number;
      price?: number;
      gearbox?: string;
      transmissionSystem?: string;
      numberOfDoors?: number;
    },
  ): Promise<Car[]> {
    const where: Prisma.CarWhereInput = {
      name: filters.name
        ? { contains: filters.name, mode: 'insensitive' }
        : undefined,
      year: filters.year ? { equals: filters.year } : undefined,
      mileage: filters.mileage ? { equals: filters.mileage } : undefined,
      price: filters.price ? { equals: filters.price } : undefined,
      gearbox: filters.gearbox
        ? { equals: filters.gearbox, mode: 'insensitive' }
        : undefined,
      transmissionSystem: filters.transmissionSystem
        ? { equals: filters.transmissionSystem, mode: 'insensitive' }
        : undefined,
    };

    const cars = await this.prisma.car.findMany({
      where: where,
      take: perPage,
      skip: perPage * (page - 1),
    });

    return cars;
  }

  async findAllPagination(page: number, perPage: number): Promise<Car[]> {
    const cars = await this.prisma.car.findMany({
      take: perPage,
      skip: perPage * (page - 1),
    });

    if (!cars.length) {
      throw new HttpException('Cars not found', HttpStatus.NOT_FOUND);
    }

    return cars;
  }

  async count(): Promise<number> {
    return this.prisma.car.count();
  }

  async findAll(): Promise<Car[]> {
    const cars = await this.prisma.car.findMany();
    if (!cars.length) {
      throw new HttpException('Cars not found', HttpStatus.NOT_FOUND);
    }
    return cars;
  }

  async update(id: string, data: UpdateCarDto): Promise<Car> {
    return this.prisma.car.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Car> {
    return this.prisma.car.delete({ where: { id } });
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.prisma.car.findUnique({ where: { id } });

    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    return car;
  }

  async findOneWithMessages(idCar: number): Promise<Car> {
    const car = await this.prisma.car.findUnique({
      where: { idCar },
      include: { messages: true },
    });

    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    return car;
  }

  async countMessages(idCar: number): Promise<number> {
    idCar = idCar ? Number(idCar) : null;

    if (!idCar) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    const car = await this.findOneWithMessages(idCar);

    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const countMessages = car.messages ? car.messages.length : 0;

    return countMessages;
  }

  async findOneCarId(idCar: number): Promise<Car> {
    const car = await this.prisma.car.findUnique({ where: { idCar } });

    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    return car;
  }
}
