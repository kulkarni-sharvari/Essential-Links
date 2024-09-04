import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Consignment {
    @Field()
    shipmentId: string;

    @Field(() => [String])
    batchId?: string[];

    @Field()
    storagePlantId: number;

    @Field()
    carrier: string;

    @Field()
    status: string;

    @Field({nullable: true})
    blockchainHash?: string;
    
    @Field()
    departureDate: Date;
    
    @Field()
    expectedArrivalDate: Date;
    
    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class ConsignmentOutput {
    @Field()
    shipmentId: string;

    @Field()
    batchId?: string;

    @Field()
    storagePlantId: number;

    @Field()
    carrier: string;

    @Field()
    status: string;

    @Field({nullable: true})
    blockchainHash?: string;
    
    @Field()
    departureDate: Date;
    
    @Field()
    expectedArrivalDate: Date;
    
    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
