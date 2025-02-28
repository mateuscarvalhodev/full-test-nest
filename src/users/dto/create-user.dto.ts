import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Mateus',
    description: 'Nome do usuario',
  })
  @IsString()
  name: string;
}
