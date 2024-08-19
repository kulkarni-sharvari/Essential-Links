import { SmartContractRepository } from "@/repositories/smartContract.repository";
import { SmartContractTxResponse } from "@/typedefs/smartcontract.type";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class SmartContractResolver extends SmartContractRepository {

    /**
     * Calls repository function to get value from SC
     * @returns value from SC
     */
    @Query(() => String, {
        description: "Get value from sample contract",
    })
    async getTransaction(): Promise<String> {
        return await this.getTx();
    }

    /**
     * 
     * @param value sets `value` in SC
     * @returns Transaction response
     */
    @Mutation(() => SmartContractTxResponse, {
        description: "Sets value to sample contract"
    })
    async setValue(@Arg('value') value: number): Promise<SmartContractTxResponse> {
        return await this.setTx(value)
    }

}