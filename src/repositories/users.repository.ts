//  Imports the `hash` function from `bcrypt`, which is used to encrypt passwords before storing them in the database
import { hash } from 'bcrypt';
// Imports the `EntityRepository` decorator from TypeORM, which is used to define custom repository classes
import { EntityRepository } from 'typeorm';
// Imports the data transfer object
import { CreateUserDto } from '@dtos/users.dto';
// Imports the `UserEntity` class, which represents the user table in the database.
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@typedefs/users.type';
import { TransactionEntity } from '@/entities/transaction.entity';
import { RequestStatusResultUnion } from '@/typedefs/requestStatus.type';
import { TeaHarvests } from '@/typedefs/teaHarvests.type';
import { Transaction } from '@/typedefs/transaction.type';
import { TeaHarvestsEntity } from '@/entities/harvests.entity';

@EntityRepository(UserEntity)
// A class that handles various user-related database operations
export class UserRepository {
  public async userFindAll(): Promise<User[]> {
    const users: User[] = await UserEntity.find();

    return users;
  }

  public async userFindById(userId: number): Promise<User> {
    const user: User = await UserEntity.findOne({ where: { id: userId } });
    if (!user) throw new HttpException(409, "User doesn't exist");

    return user;
  }

  public async userCreate(userData: CreateUserDto): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();

    return createUserData;
  }

  public async getRequestDetails(requestId: string): Promise<User | TeaHarvests | Transaction> {
    const findRequest: Transaction = await TransactionEntity.findOne({ where: { requestId: requestId } });
    if (!findRequest) throw new HttpException(409, `Request Id ${requestId} does not exists`);
    if (findRequest.status !== 'COMPLETED') {
      const tx = new Transaction();
      tx.userId = findRequest.userId;
      tx.methodName = findRequest.methodName;
      tx.status = findRequest.status;
      tx.payload = findRequest.payload;
      tx.requestId = findRequest.requestId;
      tx.txHash = findRequest.txHash;
      tx.updatedAt = findRequest.updatedAt;
      tx.createdAt = findRequest.createdAt;
      tx.entityId = findRequest.entityId;
      tx.errorMessage = findRequest.errorMessage;
      return tx;
    }

    switch (findRequest.methodName) {
      case 'registerUser':
        const findUser: User = await UserEntity.createQueryBuilder('user')
          .select(['user.id', 'user.email', 'user.role', 'user.location', 'user.walletAddress'])
          .where('user.id = :id', { id: findRequest.userId })
          .getOne();
        let user = new User();
        user.id = findUser.id;
        user.email = findUser.email;
        user.location = findUser.location;
        user.role = findUser.role;
        user.walletAddress = findUser.walletAddress;
        return user;

      case 'recordHarvest':
        const findHarvest: TeaHarvests = await TeaHarvestsEntity.findOne({ where: { harvestId: findRequest.entityId } });
        console.log('HArvest', findHarvest);
        let harvest = new TeaHarvests();
        harvest.harvestId = findHarvest.harvestId;
        harvest.quality = findHarvest.quality;
        harvest.quantity = findHarvest.quantity;
        harvest.userId = findHarvest.userId;
        harvest.location = findHarvest.location;
        harvest.createdAt = findHarvest.createdAt;
        return harvest;

      default:
        break;
    }
  }
}
