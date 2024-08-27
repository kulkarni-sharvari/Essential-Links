import { GAS_LIMIT } from '@/config';
import { logger } from '@/utils/logger';

export class Utility {
  static async invokeContractGetMethod(contractInstance: any, method: string, payload: any) {
    logger.info(`invoking invokeContractGetMethod with method ${method} and input ${payload}`);
    try {
      let contractResponse;
      if (payload === null || payload === undefined) {
        // added this if clause for simple storage getValue call
        contractResponse = await contractInstance.methods[method]().call();
      } else {
        contractResponse = await contractInstance.methods[method](payload).call();
      }

      return contractResponse.toString();
    } catch (err) {
      throw err;
    }
  }

  static async invokeContractPostMethod(contractInstance: any, method: string, payload: any, senderAddress: string) {
    logger.info(`invoking invokeContractPostMethodWithoutSigning with method ${method} and input ${payload}`);
    try {
      // TODO:
      const txObject = {
        from: senderAddress,
        gas: GAS_LIMIT,
      };
      return await contractInstance.methods[method](...payload).send(txObject);
    } catch (err) {
      throw err;
    }
  }
}
