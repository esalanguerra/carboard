import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CarsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.car.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.car.findUnique({
      where: {
        id_car: id,
      },
    });
  }
}
