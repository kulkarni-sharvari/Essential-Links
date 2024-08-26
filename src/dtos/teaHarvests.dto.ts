import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { TeaHarvests } from '@/typedefs/teaHarvests.type';

// InputType(): Marks a class as an input type for GraphQL, meaning it can be used as input in GraphQL queries and mutations

// Field(): Marks a class property as a GraphQL field, making it accessible in GraphQL queries and mutations

@InputType()
// the class will have fields that partially match the `TeaHarvests` type, though they are optional in the context of `Partial<TeaHarvests>`
export class TeaHarvestsDto implements Partial<TeaHarvests> {

  @Field()
  @IsNotEmpty()
  userId: number;

  @Field()
  @IsNotEmpty()
  quantity: number;

  @Field()
  @IsNotEmpty()
  quality: string;

  @Field()
  @IsNotEmpty()
  location: string;
}
@InputType()

// the class will have fields that partially match the `TeaHarvests` type, though they are optional in the context of `Partial<TeaHarvests>`
export class UpdateTeaHarvestsDto implements Partial<TeaHarvests> {

  @Field()
  @IsNotEmpty()
  harvestId: string;

  @Field()
  @IsNotEmpty()
  blockchainHash: string;

}