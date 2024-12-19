import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CarsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findWithFilter(
    page: number = 1,
    perPage = 10,
    name?: string,
    mileage?: string,
    year?: number,
    maxPrice?: number,
    engine?: string,
    driveType?: string,
    numberOfPeople?: number,
    numberOfDoors?: number
  ) {
    const filters: any = {};

    if (name) {
      filters.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (mileage) {
      filters.mileage = {
        contains: mileage,
        mode: "insensitive",
      };
    }

    if (year) {
      filters.year = {
        equals: year,
      };
    }

    if (maxPrice) {
      filters.price = {
        lte: maxPrice,
      };
    }

    if (engine) {
      filters.engine = {
        contains: engine,
        mode: "insensitive",
      };
    }

    if (driveType) {
      filters.driveType = {
        contains: driveType,
        mode: "insensitive",
      };
    }

    if (numberOfPeople) {
      filters.numberOfPeople = {
        equals: numberOfPeople,
      };
    }

    if (numberOfDoors) {
      filters.numberOfDoors = {
        equals: numberOfDoors,
      };
    }

    const cars = await this.prismaService.car.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: filters,
    });

    return cars;
  }

  async findAll(page: number = 1, perPage = 10) {
    const cars = await this.prismaService.car.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return cars;
  }

  async findOne(id: string) {
    const car = await this.prismaService.car.findUnique({
      where: {
        id_car: id,
      },
    });

    if (!car) {
      throw new Error("Car not found");
    }

    return car;
  }
}
