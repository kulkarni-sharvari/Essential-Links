import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Packets {
    @Field()
    packageId: string;

    @Field()
    batchId: string;

    @Field({nullable: true})
    blockchainHash?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
    
    @Field()
    weight: string;
    
}