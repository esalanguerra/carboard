import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return await this.prismaService.customers.create({
      data: createCustomerDto,
    });
  }

  async findAll() {
    return await this.prismaService.customers.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.customers.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return await this.prismaService.customers.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.customers.delete({
      where: { id },
    });
  }
}
