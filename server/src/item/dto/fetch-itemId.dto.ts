// fetch-item.dto.ts
import { IsUUID } from 'class-validator';

export class FetchItemIdDto {
  @IsUUID()
  id: string;
}
