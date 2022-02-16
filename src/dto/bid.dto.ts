import { ApiPropertyOptional } from '@nestjs/swagger';

export class BidDTO {
  @ApiPropertyOptional()
  readonly from?: string;
  readonly to?: string;
  readonly value?: number;
  readonly r?: string;
  readonly s?: string;
  readonly v?: number;
}
