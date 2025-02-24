import { logger } from '@/utils/logger';

export class Utility {
  static async invokeContractGetMethod(contractInstance: any, method: string, payload: any = null): Promise<string> {
    logger.info(`Invoking invokeContractGetMethod with method: ${method} and input: ${JSON.stringify(payload)}`);
    try {
      let contractResponse;

      if (payload === null || payload === undefined) {
        contractResponse = await contractInstance.methods[method]().call();
      } else {
        contractResponse = await contractInstance.methods[method](...payload).call();
      }
      return contractResponse;
    } catch (error) {
      logger.error(`Error in invokeContractGetMethod for method: ${method} with payload: ${JSON.stringify(payload)} - ${error.message}`);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  static async invokeContractPostMethod(contractInstance: any, method: string, payload: any[], senderAddress: string): Promise<any> {
    logger.info(`Invoking invokeContractPostMethod with method: ${method} and input: ${JSON.stringify(payload)} from sender: ${senderAddress}`);
    try {
      const gas = await contractInstance.methods[method](...payload).estimateGas({ from: senderAddress });
      const txObject = {
        from: senderAddress,
        gas: gas,
      };

      const res = await contractInstance.methods[method](...payload).send(txObject);
      return res.transactionHash.toString();
    } catch (error) {
      logger.error(
        `Error in invokeContractPostMethod for method: ${method} with payload: ${JSON.stringify(payload)} from sender: ${senderAddress} - ${
          error.message
        }`,
      );
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}
