import { TeaHarvestsDto } from "@/dtos/teaHarvests.dto";
import { TeaHarvestsEntity } from "@/entities/harvests.entity";
import { TeaHarvestsRepository } from "@/repositories/harvests.repository";
import { TeaHarvests } from "@/typedefs/teaHarvests.type";
import { Arg, Authorized, Mutation, Resolver } from "type-graphql";

@Resolver()
export class TeaHarvestsResolver extends TeaHarvestsRepository {

    /**
     * 
     * @param harvestInput takes input to add harvest details in DB
     * @returns record inserted in DB
     */
    @Authorized()
    @Mutation(() => TeaHarvests, { description: "Creates Harvests" })
    async createHarvest(@Arg('harvest') harvestInput: TeaHarvestsDto): Promise<TeaHarvests> {
        console.log("createHarvest", harvestInput)
       const harvest = await this.harvestCreate(harvestInput);
       return harvest;
    }
}
