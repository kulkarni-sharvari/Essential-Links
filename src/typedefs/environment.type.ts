import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Environment {
    @Field()
    shipmentId: string;

    @Field()
    batchId?: string;

    @Field()
    track: string;

    @Field()
    temperature: string;
    
    @Field()
    humidity: string;


    @Field()
    updatedAt: Date;
}