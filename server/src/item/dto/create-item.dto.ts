import { ItemDto } from './item.dto';
import { IsOptional, IsUrl, ValidateIf } from 'class-validator';

export class CreateItemDto extends ItemDto {
  @IsOptional()
  @ValidateIf(o => o.image != null)
  @IsUrl({
    require_protocol: true, // if you want to require the http:// or https://
  })
  image?: string;
}








// import { ItemDto } from './item.dto';
// import { IsUrl } from 'class-validator';

// export class CreateItemDto extends ItemDto {
//   @IsUrl({
//     require_protocol: true,
//   })
//   image?: string;
// }
