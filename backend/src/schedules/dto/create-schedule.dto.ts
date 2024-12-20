import { SCHEDULE_STATUS } from '@prisma/client';

export class CreateScheduleDto {
  filters?: {
    name?: string;
    year?: number;
    mileage?: number;
    price?: number;
    gearbox?: string;
    transmissionSystem?: string;
    numberOfDoors?: number;
  };
  templateMessageId: string;
  status?: SCHEDULE_STATUS;
  userId: string;
}
