import { USER_ROLE } from "@/constants";
import { ConsignmentDto, UpdateConsignmentBlockchainDto, UpdateConsignmentEnvDetailsDto, UpdateConsignmentStatusDto } from "@/dtos/consignment.dto";
import { ConsignmentRepository } from "@/repositories/consignment.repository";
import { Consignment } from "@/typedefs/consignment.type";
import { User } from "@/typedefs/users.type";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class ConsignmentResolver extends ConsignmentRepository {
    @Authorized([USER_ROLE.SHIPMENT_COMPANY])
    @Mutation(() => Consignment, { description: "Create a consignment of multiple batches" })
    async createConsignment(@Arg('consignments') consignments: ConsignmentDto[], @Ctx('user') userData: User) {
        const consignment = await this.consignmentCreate(consignments, userData)
        return consignment
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