import { Controller, Get, Param, Query } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Get()
  findAllPagination(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ) {
    return this.carsService.findAll(page, perPage);
  }
}
