import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';

export class ItemDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  keywords: string[];

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsLongitude()
  lon: number;
}
