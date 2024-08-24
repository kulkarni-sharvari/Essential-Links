import { ConsignmentDto } from "@/dtos/consignment.dto";
import { ConsignmentRepository } from "@/repositories/consignment.repository";
import { Consignment } from "@/typedefs/consignment.type";
import { User } from "@/typedefs/users.type";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class ConsignmentResolver extends ConsignmentRepository {
    @Authorized()
    @Mutation(() => Consignment, { description: "Create a consignment of multiple batches" })
    async createConsignment(@Arg('consignments') consignments: ConsignmentDto[], @Ctx('user') userData: User) {
        const consignment = await this.consignmentCreate(consignments, userData)
        console.log(consignment)
        return consignment
    }
}