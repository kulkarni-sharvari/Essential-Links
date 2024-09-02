import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Environment {
    @Field()
    shipmentId: string;

    @Field()
    track: string;

    @Field()
    temperature: string;
    
    @Field()
    humidity: string;


    @Field()
    updatedAt: Date;

    @Field({nullable: true})
    blockchainHash?: string;
}