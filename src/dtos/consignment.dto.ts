import {  IsEnum, IsNotEmpty, Validate } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { Consignment } from '@/typedefs/consignment.type';
import { CARRIER, STATUS_TRACK } from '@/constants';
import { IsAfterOrEqualConstraint } from '@/utils/etaDepatureDateValidator';

// InputType(): Marks a class as an input type for GraphQL, meaning it can be used as input in GraphQL queries and mutations

// Field(): Marks a class property as a GraphQL field, making it accessible in GraphQL queries and mutations

// the class will have fields that partially match the `Consignment` type, though they are optional in the context of `Partial<Consignment>`

// Custom validation constraint

@InputType()
export class ConsignmentDto implements Partial<Consignment> {
  @Field(() => [String])
  @IsNotEmpty()
  batchId: string[];

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
  // custom validator
  @Validate(IsAfterOrEqualConstraint, ['departureDate'])
  expectedArrivalDate: Date;
}

@InputType()
// the class will have fields that partially match the `Consignment` type, though they are optional in the context of `Partial<Consignment>`
export class UpdateConsignmentStatusDto implements Partial<Consignment> {
  @Field()
  @IsNotEmpty()
  shipmentId: string;

  @Field(() => [String])
  @IsNotEmpty()
  batchId: string[];

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

  @Field(() => [String])
  @IsNotEmpty()
  batchId: string[];

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

  @Field(() => [String])
  @IsNotEmpty()
  batchId: string[];

  @Field()
  @IsNotEmpty()
  humidity: string;

  @Field()
  @IsNotEmpty()
  temperature: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(STATUS_TRACK, { message: 'Track must be one of the following: TRANSIT, WAREHOUSE, RETAILER' })
  track: string;
}
