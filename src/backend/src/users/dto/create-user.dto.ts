import { USER_STATUS } from "@prisma/client";

export class CreateUserDto {
  sub_firebase: string;
  full_name: string;
  status?: USER_STATUS = USER_STATUS.ACTIVE;
  vat: string;
  phone_number: string;
}
