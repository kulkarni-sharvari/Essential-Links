import { verify } from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import { getRepository } from 'typeorm';
import { SECRET_KEY } from '@config';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser, DataStoredInToken } from '@interfaces/auth.interface';

const getAuthorization = req => {
  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async req => {
  try {
    const Authorization = getAuthorization(req);
    
    if (Authorization) {
      const { id } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      const userRepository = getRepository(UserEntity);
      const findUser = await userRepository.findOne(id, { select: ['id', 'email', 'password', 'role'] });
      return findUser;
    }

    return null;
  } catch (error) {
    throw new HttpException(401, 'Wrong authentication token');
  }
};

export const AuthCheckerMiddleware: AuthChecker<RequestWithUser> = async ({ context: { user } }, roles) => {
  if (!user) {
    throw new HttpException(404, 'Authentication token missing');
  }
  if ((roles.length >0) && (!roles.includes(user.role))) {throw new HttpException(404, `This operation can be done only by ${roles}`);}  // added for rbac
  return true;
};
