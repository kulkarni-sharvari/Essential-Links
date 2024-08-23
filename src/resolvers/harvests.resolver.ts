import { TeaHarvestsDto, UpdateTeaHarvestsDto } from "@/dtos/teaHarvests.dto";
import { TeaHarvestsEntity } from "@/entities/harvests.entity";
import { User } from "@/interfaces/users.interface";
import { TeaHarvestsRepository } from "@/repositories/harvests.repository";
import { TeaHarvests } from "@/typedefs/teaHarvests.type";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

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
        const harvest = await this.harvestCreate(harvestInput);
        return harvest;
    }

    /**
     * 
     * @param harvestInput gets harvestId and Blockchain Hash from events
     * @param userData gets user details from context
     * @returns updated record of harvest
     */
    @Authorized()
    @Mutation(() => TeaHarvests, { description: "Updates blockchainHash value" })
    async updateHarvest(@Arg('harvest') harvestInput: UpdateTeaHarvestsDto, @Ctx('user') userData: User): Promise<TeaHarvests> {
        const updatedHarvest = await this.harvestUpdate(harvestInput, userData);
        return updatedHarvest
    }

    /**
     * 
     * @param user gets user details from context
     * @returns all the harvests done by a farmer
     */
    @Authorized()
    @Query(() => [TeaHarvests], { description: "Get all harvests done by a farmer" })
    async getAllHarvestByFarmerId(@Ctx('user') user: User): Promise<TeaHarvests[]> {
        const allHarvests = await this.readAllHarvestByFarmerId(user)
        console.log("allHarvests", allHarvests)
        return allHarvests;
    }
}
