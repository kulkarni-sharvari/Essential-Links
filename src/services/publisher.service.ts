import path from 'path';
import { PubSub } from '@google-cloud/pubsub';
import { TeaSupplyChain } from './blockchain/teaSupplyChain.service';
import { logger } from '@/utils/logger';
import { TransactionHandler } from './blockchain/transactionHandler.service';
const keyFilePath: string = path.join(__dirname, '../config/pub-sub.json');
const topicName = process.env.TOPIC_NAME;
const subscriptionName = process.env.SUB_NAME;
const transactionHander = new TransactionHandler().getInstance();
class Publisher {
  private pubSubClient: PubSub;
  private topicName: string;
  private subName: string;

  constructor() {
    // Create an instance of PubSub with the provided service account key
    this.pubSubClient = new PubSub({
      keyFilename: keyFilePath,
    });
    this.topicName = topicName;
    this.subName = subscriptionName;
  }

  public async publish(tx: any): Promise<any> {
    try {
      const requestId = await transactionHander.addTxToDb(tx);
      tx['requestId'] = requestId;
      const dataBuffer = Buffer.from(JSON.stringify(tx));
      await this.pubSubClient.topic(this.topicName).publishMessage({ data: dataBuffer });
      return requestId;
    } catch (error) {
      logger.error(`Received error while publishing: ${(error as Error).message}`);
      process.exitCode = 1;
      throw error;
    }
  }

  public async subscribe() {
    const subClient = this.pubSubClient.subscription(this.subName, {
      flowControl: {
        maxMessages: 1,
      },
    });

    subClient.on('message', this.messageHandler.bind(this));
    logger.info(` Transaction Listenre Started....`);
  }

  private async messageHandler(message: any) {
    try {
      await transactionHander.handleTransaction(JSON.parse(message.data));
      // message.ack();
    } catch (error) {
      logger.info(`Error in messageHandler:  ${error.message}`);
    } finally {
      message.ack();
      console.log('Finally');
    }
  }
}

class Singleton {
  private static instance: Publisher;

  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new Publisher();
    }
  }
  getInstance() {
    return Singleton.instance;
  }
}

export { Singleton as Publisher };
