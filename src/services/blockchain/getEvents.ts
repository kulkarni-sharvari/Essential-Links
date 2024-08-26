import { ethers } from "ethers";
import * as tscContractDetails from '../../../blockchain/artifacts/contracts/TeaSupplyChain.sol/SupplyChain.json';
import { BESU_URL, SUPPLYCHAIN_ADDRESS, GAS_LIMIT } from '@config';
import { ProcessEvents } from '@/utils/processEvents';

export class GetEvents {
    provider: any;
   // private abi: any;
    private contractInstance: any;

    constructor() {
        this.provider = new ethers.JsonRpcProvider(BESU_URL);
       // this.abi = tscContractDetails.abi;
        this.contractInstance = new ethers.Contract(
            SUPPLYCHAIN_ADDRESS,
            tscContractDetails.abi,
            this.provider
          );
      }

    async startEventListener() {
        console.log("came to start event listern ")
        this.contractInstance.on(
            "BatchCreated", async( batchId, harvestId, quantity, packetIds, timestamp, eventPayload) => {
                await new ProcessEvents().addBlockchainHashToTable({batchId, harvestId, quantity, packetIds, timestamp}, eventPayload, "BatchCreated")
            }
        )

        this.contractInstance.on(
            "ConsignmentCreated", async( consignmentId, batchIds, carrier, departureDate, eta, timestamp, eventPayload) => {
                await new ProcessEvents().addBlockchainHashToTable({consignmentId, batchIds, carrier, departureDate, eta, timestamp}, eventPayload, "ConsignmentCreated")
            }
        )

        this.contractInstance.on(
            "ConsignmentUpdated", async( consignmentId, temperature, humidity, status, timestamp, eventPayload) => {
                await new ProcessEvents().addBlockchainHashToTable({consignmentId, temperature, humidity, status, timestamp}, eventPayload, "ConsignmentUpdated")
            }
        )

        this.contractInstance.on(
            "LeavesHarvested", async( harvestId, date, quality, quantity, location, farmerId, timestamp, eventPayload) => {
                console.log("harvest created ", eventPayload)
                await new ProcessEvents().addBlockchainHashToTable({harvestId, date, quality, quantity, location, farmerId, timestamp}, eventPayload, "LeavesHarvested")
            }
        )

        this.contractInstance.on(
            "PacketsCreated", async( batchId, packteIds, timestamp, eventPayload) => {
                await new ProcessEvents().addBlockchainHashToTable({batchId, packteIds, timestamp}, eventPayload, "PacketsCreated")
            }
        )

        this.contractInstance.on(
            "ProcessingDetailsUpdated", async( harvestId, status, timestamp, eventPayload) => {
                await new ProcessEvents().addBlockchainHashToTable({harvestId, status, timestamp}, eventPayload, "ProcessingDetailsUpdated")
            }
        )

        this.contractInstance.on(
            "UserRegistered", async( accountAddress, userId, role, eventPayload) => {
                console.log("user registered event ")
                role = role.toString()
                await new ProcessEvents().addBlockchainHashToTable({accountAddress, userId, role}, eventPayload, "UserRegistered")
            }
        )
    }

}

//new GetEvents().startEventListener();