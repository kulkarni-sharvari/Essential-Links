import { ethers } from 'ethers';
import * as tscContractDetails from '../../../blockchain/artifacts/contracts/TeaSupplyChain.sol/SupplyChain.json';
import { BESU_URL, SUPPLYCHAIN_ADDRESS, GAS_LIMIT } from '@config';
import { ProcessEvents } from '@/utils/processEvents';
import { PROCESSING_STATUS, USER_ROLES, STATUS_TRACKING } from '../../constants';

export class GetEvents {
  provider: any;
  // private abi: any;
  private contractInstance: any;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(BESU_URL);
    // this.abi = tscContractDetails.abi;
    this.contractInstance = new ethers.Contract(SUPPLYCHAIN_ADDRESS, tscContractDetails.abi, this.provider);
  }

  async startEventListener() {
    this.contractInstance.on('BatchCreated', async (batchId, harvestId, quantity, packetIds, timestamp, eventPayload) => {
      timestamp = this.convertDate(timestamp);
      await new ProcessEvents().addBlockchainHashToTable({ batchId, harvestId, quantity, packetIds, timestamp }, eventPayload, 'BatchCreated');
    });

    this.contractInstance.on('ConsignmentCreated', async (shipmentId, batchIds, carrier, departureDate, eta, timestamp, eventPayload) => {
      timestamp = this.convertDate(timestamp);
      await new ProcessEvents().addBlockchainHashToTable(
        { shipmentId, batchIds, carrier, departureDate, eta, timestamp },
        eventPayload,
        'ConsignmentCreated',
      );
    });

    this.contractInstance.on('ConsignmentUpdated', async (shipmentId, temperature, humidity, status, timestamp, eventPayload) => {
      timestamp = this.convertDate(timestamp);
      status = STATUS_TRACKING[status];
      await new ProcessEvents().addBlockchainHashToTable(
        { shipmentId, temperature, humidity, status, timestamp },
        eventPayload,
        'ConsignmentUpdated',
      );
    });

    this.contractInstance.on('LeavesHarvested', async (harvestId, date, quality, quantity, location, farmerId, timestamp, eventPayload) => {
      timestamp = this.convertDate(timestamp);
      //timestamp = timestamp.toString
      await new ProcessEvents().addBlockchainHashToTable(
        { harvestId, date, quality, quantity, location, farmerId, timestamp },
        eventPayload,
        'LeavesHarvested',
      );
    });

    this.contractInstance.on('PacketsCreated', async (batchId, packteIds, timestamp, eventPayload) => {
      timestamp = this.convertDate(timestamp);
      await new ProcessEvents().addBlockchainHashToTable({ batchId, packteIds, timestamp }, eventPayload, 'PacketsCreated');
    });

    this.contractInstance.on('ProcessingDetailsUpdated', async (harvestId, status, timestamp, eventPayload) => {
      timestamp = this.convertDate(timestamp);
      status = PROCESSING_STATUS[status];
      await new ProcessEvents().addBlockchainHashToTable({ harvestId, status, timestamp }, eventPayload, 'ProcessingDetailsUpdated');
    });

    this.contractInstance.on('UserRegistered', async (accountAddress, userId, role, timestamp, eventPayload) => {
      timestamp = this.convertDate(timestamp);
      role = USER_ROLES[role];
      await new ProcessEvents().addBlockchainHashToTable({ accountAddress, userId, role, timestamp }, eventPayload, 'UserRegistered');
    });
  }

  convertDate(blockchainTimestamp: any): string {
    const date = new Date(Number(blockchainTimestamp) * 1000);
    return date.toISOString();
  }
}

//new GetEvents().startEventListener();
