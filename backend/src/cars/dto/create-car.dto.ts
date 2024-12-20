import {
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  IsObject,
  IsDateString,
} from 'class-validator';

export class CreateCarDto {
  @IsInt()
  idCar: number;

  @IsOptional()
  @IsString()
  seller?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsOptional()
  @IsString()
  owners?: string;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsInt()
  mileage?: number;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  engine?: string;

  @IsOptional()
  @IsString()
  gearbox?: string;

  @IsOptional()
  @IsString()
  inspected?: string;

  @IsOptional()
  @IsString()
  driveType?: string;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  safety?: string;

  @IsOptional()
  @IsObject()
  espercifications?: Record<string, any>;

  @IsOptional()
  @IsString()
  transmissionSystem?: string;

  @IsOptional()
  @IsString()
  inspection?: string;

  @IsOptional()
  @IsString()
  interior?: string;

  @IsOptional()
  @IsString()
  electronics?: string;

  @IsOptional()
  @IsString()
  additionalInformation?: string;

  @IsOptional()
  @IsString()
  others?: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  phone: string;

  @IsString()
  link: string;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @IsOptional()
  @IsDateString()
  updatedAt?: Date;
}
