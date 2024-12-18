import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CarsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const cars = await this.prismaService.car.findMany();

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
