import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientDto {
  @ApiProperty({
    example: 'Mateus',
    description: 'Nome do cliente',
    required: false,

  })
  name?: string;

  @ApiProperty({
    example: 2000,
    description: 'Salário do cliente',
    required: false,
  })
  salary?: number;

  @ApiProperty({
    example: 20000,
    description: 'Valor da empresa',
    required: false,
  })
  enterprisePrice?: number;

}