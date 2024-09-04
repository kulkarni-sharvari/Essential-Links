import { USER_ROLE } from '@/constants';
import { ConsignmentDto, UpdateConsignmentBlockchainDto, UpdateConsignmentEnvDetailsDto, UpdateConsignmentStatusDto } from '@/dtos/consignment.dto';
import { ConsignmentRepository } from '@/repositories/consignment.repository';
import { Consignment } from '@/typedefs/consignment.type';
import { Arg, Authorized, Ctx, Mutation, Resolver, Query } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
@Resolver()
export class ConsignmentResolver extends ConsignmentRepository {
  @Authorized([USER_ROLE.SHIPMENT_COMPANY])
  @Mutation(() => String, { description: 'Create a consignment of multiple batches' })
  async createConsignment(@Ctx('user') userData: any, @Arg('consignments', type => ConsignmentDto) consignments: ConsignmentDto) {
    return `Create Processing request submitted successfully. Request Id: ${await this.consignmentCreate(consignments, userData)}`;
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
  @Mutation(() => String, { description: 'Update environment details' })
  async updateConsignmentEnvDetails(@Arg('consignment') consignment: UpdateConsignmentEnvDetailsDto, @Ctx('user') userData: any): Promise<string> {
    return `Update Consignment Env Details request submitted successfully. Request Id: ${await this.consignmentEnvironmentUpdate(
      consignment,
      userData,
    )}`;
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
