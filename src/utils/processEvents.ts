import { ConsignmentEntity } from "@/entities/consignment.entity";
import { EnvironmentEntity } from "@/entities/environment.entity";
import { TeaHarvestsEntity } from "@/entities/harvests.entity";
import { PacketsEntity } from "@/entities/packets.entity";
import { ProcessingEntity } from "@/entities/processing.entity";
import { EventEntity } from "@/entities/event.entity";
import { EntityRepository } from 'typeorm';

@EntityRepository(ConsignmentEntity)
@EntityRepository(EnvironmentEntity)
@EntityRepository(TeaHarvestsEntity)
@EntityRepository(PacketsEntity)
@EntityRepository(ProcessingEntity)
@EntityRepository(EventEntity)
export class ProcessEvents {

    async addBlockchainHashToTable(eventData, eventPayload, eventName) {
        const txnHash = eventPayload.log.transactionHash; 
        switch(eventName) {
            case 'BatchCreated':  
                    await PacketsEntity.createQueryBuilder()
                    .update(PacketsEntity)
                    .where({ batchId: eventData.batchId })
                    .set({ blockchainHash: txnHash })
                    .execute();
                break;

            case 'ConsignmentCreated': 
                   // await ConsignmentEntity.update(eventData.shipmentId, { blockchainHash: txnHash });
                   await ConsignmentEntity.createQueryBuilder()
                   .update(ConsignmentEntity)
                   .where({ shipmentId: eventData.shipmentId })
                   .set({ blockchainHash: txnHash })
                   .execute();
                    break;
            case 'LeavesHarvested': 
                    await TeaHarvestsEntity.update(eventData.harvestId, { blockchainHash: txnHash });
                    break;
                    // TODO add blockchainHash in processing details table then uncomment 
            // case 'ProcessingDetailsUpdated': 
            //         await ProcessingEntity.update(eventData.harvestId, { blockchainHash: txnHash });
            //         break;
            default:
                break;
                
        }   

        await EventEntity.create({
            eventDetails: eventData, 
            eventName: eventName,
            blockchainHash: txnHash
        }).save()
    }



}