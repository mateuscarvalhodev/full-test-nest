import { IsNumber, IsString } from 'class-validator';

export class GetClientDto {
  @IsString()
  name: string;

  @IsNumber()
  salary: number;

  @IsNumber()
  enterpriseValue: number;
}
