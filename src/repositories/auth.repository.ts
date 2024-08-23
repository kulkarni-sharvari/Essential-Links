/**
 * This code defines an authentication repository (`AuthRepository`) using TypeORM, which handles user sign-up, login, and logout functionalities in an application
 */

import { hash, compare } from 'bcrypt';
//  Imports the `sign` function from the `jsonwebtoken` library, used to create JSON Web Tokens (JWTs).
import { sign } from 'jsonwebtoken';
// used to create custom repositories
import { EntityRepository } from 'typeorm';
import { SECRET_KEY } from '@config';
// a class  which validates and handle user data when creating a new user.
import { CreateUserDto } from '@dtos/users.dto';
// a class which represents the user table in the database.
import { UserEntity } from '@entities/users.entity';
// a class which handles HTTP exceptions
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { JWTToken } from '@/typedefs/jwtuser.type';

import { CreateWallet } from '@/services/createWallet';
import { WalletEntity } from '@/entities/wallet.entity';

import { CryptoUtil } from '@/utils/crypto';

// Method to creates a JWT for a user
const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

// creates a cookie string for storing the JWT
const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@EntityRepository(UserEntity)
export class AuthRepository {
  // Method to creates a JWT for a user

  public async getJWTToken(userData: CreateUserDto): Promise<JWTToken> {
    const user: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (!user) throw new HttpException(409, `This email ${userData.email} was not found`);
    const isPasswordMatching: boolean = await compare(userData.password, user.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = createToken(user);
    return tokenData;
  }
  public async userSignUp(userData: CreateUserDto): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
    const walletObj = new CreateWallet().createUserWallet();
    const hashedPassword = await hash(userData.password, 10);
    const encryptedKey = new CryptoUtil().encryptPrivateKey(walletObj.privateKey)
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword , walletAddress: walletObj.address}).save();
    await WalletEntity.create({...walletObj, privateKey: encryptedKey, userId: createUserData.id}).save();
    //await WalletEntity.create({...walletObj, userId: createUserData.id}).save();
    return createUserData;
  }

  public async userLogIn(userData: CreateUserDto): Promise<{ cookie: string; findUser: User; tokenData: TokenData }> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = createToken(findUser);

    const cookie = createCookie(tokenData);

    return { cookie, findUser, tokenData };
  }

  public async userLogOut(userId: number): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
