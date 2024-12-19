import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags, ApiQuery, ApiParam, ApiOperation } from "@nestjs/swagger";
import { CarsService } from "./cars.service";

@ApiTags("cars")
@Controller("cars")
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @ApiOperation({ summary: "List all cars with pagination" })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number" })
  @ApiQuery({ name: "perPage", required: false, type: Number, description: "Number of items per page" })
  @Get()
  findAll(
    @Query("page") page?: number,
    @Query("perPage") perPage?: number,
  ) {
    return this.carsService.findAll(page, perPage);
  }

  @ApiOperation({ summary: "Filter cars based on multiple criteria" })
  @ApiQuery({ name: "page", type: Number, required: true, description: "Page number" })
  @ApiQuery({ name: "perPage", type: Number, required: true, description: "Number of items per page" })
  @ApiQuery({ name: "name", type: String, required: false, description: "Car name" })
  @ApiQuery({ name: "mileage", type: String, required: false, description: "Mileage range" })
  @ApiQuery({ name: "year", type: Number, required: false, description: "Year of manufacture" })
  @ApiQuery({ name: "maxPrice", type: Number, required: false, description: "Maximum price" })
  @ApiQuery({ name: "engine", type: String, required: false, description: "Engine type" })
  @ApiQuery({ name: "driveType", type: String, required: false, description: "Drive type (e.g., AWD)" })
  @ApiQuery({ name: "numberOfPeople", type: Number, required: false, description: "Number of passengers" })
  @ApiQuery({ name: "numberOfDoors", type: Number, required: false, description: "Number of doors" })
  @Get("filter")
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
    @Query("numberOfDoors") numberOfDoors?: number,
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
      numberOfDoors,
    );
  }

  @ApiOperation({ summary: "Find a car by its ID" })
  @ApiParam({ name: "id", type: String, description: "Car ID" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.carsService.findOne(id);
  }
}
