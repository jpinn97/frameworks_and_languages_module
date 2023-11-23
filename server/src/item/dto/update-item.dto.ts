import { ItemDto } from './item.dto';
import { IsOptional, IsUrl, ValidateIf } from 'class-validator';

export class UpdateItemDto extends ItemDto {
  @IsOptional()
  @ValidateIf(o => o.image != null)
  @IsUrl({
    require_protocol: true, // if you want to require the http:// or https://
  })
  image?: string;
}
