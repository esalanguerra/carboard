import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiParam, ApiOperation } from '@nestjs/swagger';
import { CarsService } from './cars.service';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @ApiOperation({ summary: 'Find cars by filter' })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Car name',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Car year',
  })
  @ApiQuery({
    name: 'mileage',
    required: false,
    type: Number,
    description: 'Car mileage',
  })
  @ApiQuery({
    name: 'price',
    required: false,
    type: Number,
    description: 'Car price',
  })
  @ApiQuery({
    name: 'gearbox',
    required: false,
    type: String,
    description: 'Car gearbox',
  })
  @ApiQuery({
    name: 'transmissionSystem',
    required: false,
    type: String,
    description: 'Car transmission system',
  })
  @ApiQuery({
    name: 'numberOfDoors',
    required: false,
    type: Number,
    description: 'Car number of doors',
  })
  @Get('filter')
  findByFilter(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('name') name?: string,
    @Query('year') year?: string,
    @Query('mileage') mileage?: string,
    @Query('price') price?: string,
    @Query('gearbox') gearbox?: string,
    @Query('transmissionSystem') transmissionSystem?: string,
    @Query('numberOfDoors') numberOfDoors?: string,
  ) {
    page = page ? Number(page) : 1;
    perPage = perPage ? Number(perPage) : 10;

    return this.carsService.findAllFilter(Number(page), Number(perPage), {
      name,
      year: year ? Number(year) : undefined,
      mileage: mileage ? Number(mileage) : undefined,
      price: price ? Number(price) : undefined,
      gearbox,
      transmissionSystem,
      numberOfDoors: numberOfDoors ? Number(numberOfDoors) : undefined,
    });
  }

  @ApiOperation({ summary: 'Get all cars with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @Get('pagination')
  async findAllPagination(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
  ) {
    page = page ? Number(page) : 1;
    perPage = perPage ? Number(perPage) : 10;

    return this.carsService.findAllPagination(page, perPage);
  }

  @ApiOperation({ summary: 'Count the number of cars' })
  @Get('count')
  count() {
    return this.carsService.count();
  }

  @ApiOperation({ summary: 'Get all cars' })
  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @ApiOperation({ summary: 'Find a car by its unique ID' })
  @ApiParam({ name: 'idCar', type: Number, description: 'Car unique ID' })
  @Get('id/:idCar')
  findOneCarId(@Param('idCar') idCar: number) {
    idCar = idCar ? Number(idCar) : null;

    return this.carsService.findOneCarId(idCar);
  }

  @ApiOperation({ summary: 'Count the number of messages for a car' })
  @ApiParam({ name: 'idCar', type: Number, description: 'Car unique ID' })
  @Get('id/:idCar/messages/count')
  countMessages(@Param('idCar') idCar: number) {
    return this.carsService.countMessages(idCar);
  }

  @ApiOperation({ summary: 'Find a car by its ID' })
  @ApiParam({ name: 'id', type: String, description: 'Car ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }
}
