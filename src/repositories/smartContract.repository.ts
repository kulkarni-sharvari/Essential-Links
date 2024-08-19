/**
 * Class to maintain type for smart contract
 */

export class SmartContractRepository {
    /**
     * Calls SC to get the current value
     * @returns value from SC
     */
    public async getTx(): Promise<String> {
        // call to Smart contract
        return "";
    }

    /**
     * Call SC to modify the value in SC
     * @param value : value to be set in contract
     * @returns SC Transaction object
     */
    public async setTx(value: number) {
        // call to Smart contract
        return {
            statusCode: 200,
            message: "Success",
            txHash: "0x1234"
        }
    }

}