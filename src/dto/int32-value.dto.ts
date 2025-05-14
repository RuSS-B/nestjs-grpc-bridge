import { IsNumber } from 'class-validator';

export class Int32ValueDto {
  @IsNumber()
  value: number;
}
