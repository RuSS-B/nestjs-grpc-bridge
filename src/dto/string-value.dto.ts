import { IsString } from 'class-validator';

export class StringValueDto {
  @IsString()
  value: string;
}
