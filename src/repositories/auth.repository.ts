import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { EntityRepository } from 'typeorm';
import { SECRET_KEY } from '@config';
import { CreateUserDto, UserLoginDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { WalletEntity } from '@/entities/wallet.entity';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { JWTToken } from '@/typedefs/jwtuser.type';
import { CreateWallet } from '@/services/createWallet';
import { CryptoUtil } from '@/utils/crypto';
import { getConnection } from 'typeorm';
import { Publisher } from '@/services/publisher.service';
import { containsEnumKey } from '@/utils/getErrorFromEnums';
import { DB_EXCEPTION_CODES, HTTP_STATUS_CODE } from '@/constants';
import { DBException } from '@/exceptions/DBException';
import { logger } from '@/utils/logger';

const publisher = new Publisher().getInstance();

// Method to create a JWT for a user
const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id, role: user.role };
  const expiresIn: number = 60 * 60; // Token expiry time

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

@EntityRepository(UserEntity)
export class AuthRepository {
  /**
   * Generates a JWT token for a user.
   * @param userData - User login details.
   * @returns JWT token data.
   */
  public async getJWTToken(userData: CreateUserDto): Promise<JWTToken> {
    const user: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (!user) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, user.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = createToken(user);
    return tokenData;
  }

  /**
   * Handles user sign-up functionality.
   * @param userData - User details for sign-up.
   * @returns The created user data.
   */

  public async userSignUp(userData: CreateUserDto): Promise<String> {
    const queryRunner = getConnection().createQueryRunner();

    try {
      // Create user data
      await queryRunner.startTransaction();
      const hashedPassword = await hash(userData.password, 10);
      const walletObj = new CreateWallet().createUserWallet();
      const encryptedKey = new CryptoUtil().encryptPrivateKey(walletObj.privateKey);

      const createUserData: User = await queryRunner.manager.save(UserEntity, {
        ...userData,
        password: hashedPassword,
        walletAddress: walletObj.address,
      });

      // Create wallet data
      await queryRunner.manager.save(WalletEntity, {
        ...walletObj,
        privateKey: encryptedKey,
        userId: createUserData.id,
      });

      const payload = [createUserData.walletAddress, createUserData.id, userData.role];
      const tx = {
        methodName: 'registerUser',
        payload: payload,
        userId: createUserData.id,
        entityId: createUserData.id
      };
      await queryRunner.commitTransaction();
      return await publisher.publish(tx);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error in processingCreate method:', error);
      const x = containsEnumKey(DB_EXCEPTION_CODES,error.message)
      throw new DBException(HTTP_STATUS_CODE.BAD_REQUEST, DB_EXCEPTION_CODES[x]);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Handles user login functionality.
   * @param userData - User login details.
   * @returns Object containing user data, and token data.
   */
  public async userLogIn(userData: UserLoginDto): Promise<{ findUser: User; tokenData: TokenData }> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Invalid credentials. Eithor email or password is incorrect');

    const tokenData = createToken(findUser);

    return { findUser, tokenData };
  }

  /**
   * Handles user logout functionality.
   * @param userId - The ID of the user logging out.
   * @returns The user data.
   */
  public async userLogOut(userId: number): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
