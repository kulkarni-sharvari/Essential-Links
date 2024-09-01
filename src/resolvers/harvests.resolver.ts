import { USER_ROLE } from '@/constants';
import { TeaHarvestsDto, UpdateTeaHarvestsDto } from '@/dtos/teaHarvests.dto';
import { User } from '@/interfaces/users.interface';
import { TeaHarvestsRepository } from '@/repositories/harvests.repository';
import { TeaHarvests } from '@/typedefs/teaHarvests.type';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';

@Resolver()
export class TeaHarvestsResolver extends TeaHarvestsRepository {
  /**
   *
   * @param harvestInput takes input to add harvest details in DB
   * @returns record inserted in DB
   */
  @Authorized([USER_ROLE.FARMER])
  @Mutation(() => String, { description: 'Creates Harvests' })
  async createHarvest(@Ctx('user') userData: any, @Arg('harvest') harvestInput: TeaHarvestsDto): Promise<string> {
    return `Your Create Harvest request submitted successfully. Request Id: ${await this.harvestCreate(harvestInput, userData.id)})`;
  }

  /**
   *
   * @param harvestInput gets harvestId and Blockchain Hash from events
   * @param userData gets user details from context
   * @returns updated record of harvest
   */
  @Authorized([USER_ROLE.FARMER])
  @Mutation(() => TeaHarvests, { description: 'Updates blockchainHash value' })
  async updateHarvest(@Arg('harvest') harvestInput: UpdateTeaHarvestsDto, @Ctx('user') userData: User): Promise<TeaHarvests> {
    return await this.harvestUpdate(harvestInput, userData);
  }

  /**
   *
   * @param user gets user details from context
   * @returns all the harvests done by a farmer
   */
  @Authorized([USER_ROLE.FARMER])
  @Query(() => [TeaHarvests], { description: 'Get all harvests done by a farmer' })
  async getAllHarvestByFarmerId(@Ctx('user') user: User): Promise<TeaHarvests[]> {
    return await this.readAllHarvestByFarmerId(user);
  }
}
