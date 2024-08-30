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
import { TeaSupplyChain } from '@/services/blockchain/teaSupplyChain.service';
import { getConnection } from 'typeorm';

const tsc = new TeaSupplyChain().getInstance();

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

  public async userSignUp(userData: CreateUserDto): Promise<User> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Create user data
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

      // Register the user on the blockchain
      //const res = await new TeaSupplyChain().registerUser(createUserData.walletAddress, createUserData.id.toString(), userData.role);
      const res = await tsc.registerUser(createUserData.walletAddress, createUserData.id.toString(), userData.role);
      console.log('tx Receipt', res);

      await queryRunner.commitTransaction();
      return createUserData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(500, `User registration failed: ${error.message}`);
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
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

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
