import { USER_ROLE } from '@/constants';
import { ConsignmentDto, UpdateConsignmentBlockchainDto, UpdateConsignmentEnvDetailsDto, UpdateConsignmentStatusDto } from '@/dtos/consignment.dto';
import { EnvironmentEntity } from '@/entities/environment.entity';
import { ConsignmentRepository } from '@/repositories/consignment.repository';
import { Consignment, ConsignmentOutput } from '@/typedefs/consignment.type';
import { Environment } from '@/typedefs/environment.type';
import { GetWalletInfo } from '@/utils/getWalletInfo';
import { Arg, Authorized, Ctx, Mutation, Resolver, Query } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@Resolver()
export class ConsignmentResolver extends ConsignmentRepository {
  @Authorized([USER_ROLE.SHIPMENT_COMPANY])
  @Mutation(() => [ConsignmentOutput], { description: 'Create a consignment of multiple batches' })
  async createConsignment(@Ctx('user') userData: any, @Arg('consignments', type => ConsignmentDto) consignments: ConsignmentDto) {
    const userWallet = await new GetWalletInfo().createWalletFromId(userData.id);
    const consignment = await this.consignmentCreate(consignments, userData, userWallet);
    return consignment;
  }

  @Authorized([USER_ROLE.SHIPMENT_COMPANY])
  @Mutation(() => Consignment, { description: 'Update blockchainHash on event - to_be_deleted' })
  async updateConsignmentBlockchainHash(consignment: UpdateConsignmentBlockchainDto) {
    const updatedConsignment = await this.consignmentBlockchainUpdate(consignment);
    return updatedConsignment;
  }

  @Authorized([USER_ROLE.SHIPMENT_COMPANY])
  @Mutation(() => Consignment, { description: 'Update status' })
  async updateConsignmentStatus(consignment: UpdateConsignmentStatusDto) {
    const updatedConsignment = await this.consignmentStatusUpdate(consignment);
    return updatedConsignment;
  }

  @Authorized([USER_ROLE.SHIPMENT_COMPANY])
  @Mutation(() => [Environment], { description: 'Update environment details' })
  async updateConsignmentEnvDetails(@Arg('consignment') consignment: UpdateConsignmentEnvDetailsDto, @Ctx('user') userData: any): Promise<EnvironmentEntity[]> {
    const userWallet = await new GetWalletInfo().createWalletFromId(userData.id);
    const updatedConsignment = await this.consignmentEnvironmentUpdate(consignment, userWallet);
    return updatedConsignment;
  }

    /**
   * @param batchId
   * @returns all processing details for that harvestId
   */
      @Query(() => [GraphQLJSONObject], { description: 'Get processing details for batchId' })
      async getPacketHistoryFromDB(@Arg('batchId') batchId: string): Promise<any> {
        const packetHistory = await this.getPacketHistory(batchId)
        return packetHistory;
      }
}
