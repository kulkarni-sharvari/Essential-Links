import { IsEnum, IsNotEmpty } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { Consignment } from '@/typedefs/consignment.type';
import { CARRIER, STATUS_TRACK } from '@/constants';


// InputType(): Marks a class as an input type for GraphQL, meaning it can be used as input in GraphQL queries and mutations

// Field(): Marks a class property as a GraphQL field, making it accessible in GraphQL queries and mutations


// the class will have fields that partially match the `Consignment` type, though they are optional in the context of `Partial<Consignment>`
@InputType()
export class ConsignmentDto implements Partial<Consignment> {

  @Field()
  @IsNotEmpty()
  batchId: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(CARRIER, { message: 'Carrier modes must be one of the following: ROAD, RAIL, AIR' })
  carrier: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(STATUS_TRACK, { message: 'Track status must be one of the following: TRANSIT, WAREHOUSE, RETAILER' })
  status: string;

  @Field()
  @IsNotEmpty()
  departureDate: Date;

  @Field()
  @IsNotEmpty()
  expectedArrivalDate: Date;
}

// @InputType()
// export class CreateConsignmentDto {

//   @Field(() => [ConsignmentDto])
//   consignment: ConsignmentDto[];

// }


@InputType()
// the class will have fields that partially match the `Consignment` type, though they are optional in the context of `Partial<Consignment>`
export class UpdateConsignmentStatusDto implements Partial<Consignment> {

  @Field()
  @IsNotEmpty()
  shipmentId: string;

  @Field()
  @IsNotEmpty()
  batchId: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(STATUS_TRACK, { message: 'Track status must be one of the following: TRANSIT, WAREHOUSE, RETAILER' })
  status: string;

}

@InputType()
// the class will have fields that partially match the `Consignment` type, though they are optional in the context of `Partial<Consignment>`
export class UpdateConsignmentBlockchainDto implements Partial<Consignment> {

  @Field()
  @IsNotEmpty()
  shipmentId: string;

  @Field()
  @IsNotEmpty()
  batchId: string;

  @Field()
  @IsNotEmpty()
  blockchainHash: string;

}

@InputType()
// the class will have fields that partially match the `Consignment` type, though they are optional in the context of `Partial<Consignment>`
export class UpdateConsignmentEnvDetailsDto implements Partial<Consignment> {

  @Field()
  @IsNotEmpty()
  shipmentId: string;

  @Field()
  @IsNotEmpty()
  batchId: string;

  @Field()
  @IsNotEmpty()
  humidity: number;

  @Field()
  @IsNotEmpty()
  temperature: number;

  @Field()
  @IsNotEmpty()
  track: string;

}