export class CreateScheduleDto {
  messageId: string;
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
  userId: string;
}
