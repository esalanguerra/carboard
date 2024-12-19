import { Controller, Get, Param, Query } from "@nestjs/common";
import { CarsService } from "./cars.service";

@Controller("cars")
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  findAll(
    @Query("page") page?: number,
    @Query("perPage") perPage?: number,
  ) {
    return this.carsService.findAll(page, perPage);
  }

  @Get('filter')
  findWithFilter(
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("name") name?: string,
    @Query("mileage") mileage?: string,
    @Query("year") year?: number,
    @Query("maxPrice") maxPrice?: number,
    @Query("engine") engine?: string,
    @Query("driveType") driveType?: string,
    @Query("numberOfPeople") numberOfPeople?: number,
    @Query("numberOfDoors") numberOfDoors?: number
  ) {
    year = year ? Number(year) : undefined;
    numberOfPeople = numberOfPeople ? Number(numberOfPeople) : undefined;
    numberOfDoors = numberOfDoors ? Number(numberOfDoors) : undefined;
    maxPrice = maxPrice ? Number(maxPrice) : undefined;

    return this.carsService.findWithFilter(
      page,
      perPage,
      name,
      mileage,
      year,
      maxPrice,
      engine,
      driveType,
      numberOfPeople,
      numberOfDoors
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.carsService.findOne(id);
  }
}
