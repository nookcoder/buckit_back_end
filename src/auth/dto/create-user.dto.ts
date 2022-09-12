import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../user/entities/user.entity';

export class CreateUserInput {
  @ApiProperty()
  name: string;

  @ApiProperty()
  birth: string;

  @ApiProperty()
  gender: string;

  @ApiProperty({
    type: String,
    minimum: 10,
    maximum: 12,
  })
  phoneNumber: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ type: Boolean })
  termsOfMarketing: string | boolean;
}
