import { IsNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsNumber()
  salary: number;

  @IsNumber()
  enterprisePrice: number;

  @IsNumber()
  userId: number;
}
