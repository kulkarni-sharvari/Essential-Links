import path from 'path';
import { PubSub } from '@google-cloud/pubsub';
import { TeaSupplyChain } from './blockchain/teaSupplyChain.service';
import { GetWalletInfo } from '@/utils/getWalletInfo';

const keyFilePath: string = path.join(__dirname, '../config/pub-sub.json');
const topicName = process.env.TOPIC_NAME;
const subscriptionName = process.env.SUB_NAME;
const tsc = new TeaSupplyChain().getInstance();

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

  public async publish(tx: any): Promise<string> {
    const dataBuffer = Buffer.from(JSON.stringify(tx));
    try {
      return await this.pubSubClient.topic(this.topicName).publishMessage({ data: dataBuffer });
    } catch (error) {
      console.error(`Received error while publishing: ${(error as Error).message}`);
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
    console.log(' Transaction Listenre Started....');
  }

  private async messageHandler(message: any) {
    console.log('Transaction: ', JSON.parse(message.data));
    const response = await this.handleTransaction(JSON.parse(message.data));
    console.log('Response from Blockchain:', JSON.stringify(response));
    message.ack();
  }

  private async handleTransaction(tx: any): Promise<string> {
    let result: string;
    switch (tx?.methodName) {
      case 'registerUser':
        const [accountAddress, userId, role] = tx.payload;
        result = await tsc.registerUser(accountAddress, userId, role);
        break;

      default:
        break;
    }
    return JSON.stringify(result);
  }

  private async getUserWalletDetails(userId: number): Promise<string> {
    return (await new GetWalletInfo().createWalletFromId(userId)).privateKey;
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
