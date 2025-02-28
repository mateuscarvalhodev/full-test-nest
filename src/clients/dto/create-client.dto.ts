import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    example: 'Mateus',
    description: 'Nome do cliente',
  })
  @IsString()
  name: string;
  @ApiProperty({
    example: 2000,
    description: 'Salário do cliente',
  })
  @IsNumber()
  salary: number;
  @ApiProperty({
    example: 20000,
    description: 'Valor da empresa',
  })
  @IsNumber()
  enterprisePrice: number;
  @ApiProperty({
    example: 1,
    description: 'ID do usuário que irá criar o cliente',
  })
  @IsNumber()
  userId: number;
}
