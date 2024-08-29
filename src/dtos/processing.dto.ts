import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

// Imports decorators from `type-graphql`
import { InputType, Field } from 'type-graphql';
import { Processing } from '@/typedefs/processing.type';

import { PROCESSING_TYPES } from '@/constants';

@InputType()
export class CreateProcessingDto implements Partial<Processing> {
  @Field()
  @IsString()
  @IsNotEmpty()
  harvestId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEnum(PROCESSING_TYPES, { message: 'Process Type must be one of WITHERING, ROLLING, FERMENTING, DRYING, SORTING, PACKED' })
  processType: string;

}

@InputType()
export class CreateBatchDto implements Partial<Processing> {
  @Field()
  @IsString()
  @IsNotEmpty()
  harvestId: string;

  @IsString()
  @IsNotEmpty()
  batchId: string;

  @IsString()
  @IsNotEmpty()
  packetWeight: string;

  @Field()
  @IsNotEmpty()
  noOfPackets: number;
}
