import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Processing {

  @Field()
  harvestId?: string;

  @Field()
  packagingPlantId: string;

  @Field()
  processType: string;

}
