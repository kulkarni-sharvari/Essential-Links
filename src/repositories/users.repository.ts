//  Imports the `hash` function from `bcrypt`, which is used to encrypt passwords before storing them in the database
import { hash } from 'bcrypt';
// Imports the `EntityRepository` decorator from TypeORM, which is used to define custom repository classes
import { EntityRepository } from 'typeorm';
// Imports the data transfer object
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
// Imports the `UserEntity` class, which represents the user table in the database.
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/httpException';
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
    console.log("before creating wqallet address")
   console.log("Password", userData.password)
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();
    
    return createUserData;
  }

  public async userUpdate(userId: number, userData: UpdateUserDto): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    await UserEntity.update(userId, { ...userData, password: hashedPassword });

    const updateUser: User = await UserEntity.findOne({ where: { id: userId } });
    return updateUser;
  }

  public async userDelete(userId: number): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserEntity.delete({ id: userId });
    return findUser;
  }
}
