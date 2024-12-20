import { ApiProperty } from '@nestjs/swagger';
import { USER_STATUS } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Firebase unique identifier for the user',
    example: 'firebase_12345',
  })
  subFirebase: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'Status of the user',
    example: USER_STATUS.ACTIVE,
    default: USER_STATUS.ACTIVE,
    enum: USER_STATUS,
  })
  status?: USER_STATUS = USER_STATUS.ACTIVE;

  @ApiProperty({
    description: 'VAT (Value Added Tax) number of the user',
    example: '123456789',
  })
  vat: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  phoneNumber: string;
}
