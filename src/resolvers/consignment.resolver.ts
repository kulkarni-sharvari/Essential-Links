import { USER_ROLE } from "@/constants";
import { ConsignmentDto, UpdateConsignmentBlockchainDto, UpdateConsignmentEnvDetailsDto, UpdateConsignmentStatusDto } from "@/dtos/consignment.dto";
import { TeaHarvestsDto } from "@/dtos/teaHarvests.dto";
import { ConsignmentRepository } from "@/repositories/consignment.repository";
import { Consignment } from "@/typedefs/consignment.type";
import { Arg, Args, Authorized, Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class ConsignmentResolver extends ConsignmentRepository {
    @Authorized([USER_ROLE.SHIPMENT_COMPANY])
    @Mutation(() => Consignment, { description: "Create a consignment of multiple batches" })
    //async createConsignment(@Arg('consignment') consignmentsInput: CreateConsignmentDto, @Ctx('user') userData) {
    async createConsignment(@Arg('consignments', type => [ConsignmentDto]) consignments: ConsignmentDto[], @Ctx('user') userData) {
        // const consignment = await this.consignmentCreate(consignments, userData)
        // return consignment
    }

    @Authorized([USER_ROLE.SHIPMENT_COMPANY])
    @Mutation(() => Consignment, { description: "Update blockchainHash on event - to_be_deleted" })
    async updateConsignmentBlockchainHash(consignment: UpdateConsignmentBlockchainDto) {
        const updatedConsignment = await this.consignmentBlockchainUpdate(consignment)
        return updatedConsignment
    }

    @Authorized([USER_ROLE.SHIPMENT_COMPANY])
    @Mutation(() => Consignment, { description: "Update status" })
    async updateConsignmentStatus(consignment: UpdateConsignmentStatusDto) {
        const updatedConsignment = await this.consignmentStatusUpdate(consignment)
        return updatedConsignment
    }

    @Authorized([USER_ROLE.SHIPMENT_COMPANY])
    @Mutation(() => Consignment, { description: "Update environment details" })
    async updateConsignmentEnvDetails(consignment: UpdateConsignmentEnvDetailsDto) {
        const updatedConsignment = await this.consignmentEnvironmentUpdate(consignment)
        return updatedConsignment
    }
}