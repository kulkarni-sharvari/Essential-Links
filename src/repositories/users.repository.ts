//  Imports the `hash` function from `bcrypt`, which is used to encrypt passwords before storing them in the database
import { hash } from 'bcrypt';
// Imports the `EntityRepository` decorator from TypeORM, which is used to define custom repository classes
import { EntityRepository } from 'typeorm';
// Imports the data transfer object
import { CreateUserDto } from '@dtos/users.dto';
// Imports the `UserEntity` class, which represents the user table in the database.
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';

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

}
