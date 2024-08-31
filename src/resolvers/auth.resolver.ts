import { Authorized, Arg, Ctx, Mutation, Resolver, Query } from 'type-graphql';
// Imports a class, which defines the structure and validation for user data during signup and login
import { CreateUserDto, UserLoginDto } from '@dtos/users.dto';
// Imports a class, which contains methods for signing up, logging in, and logging out users
import { AuthRepository } from '@repositories/auth.repository';
// Imports the `User` type, which defines the structure of a user object
import { User } from '@typedefs/users.type';
import { JWTUser, JWTToken } from '@typedefs/jwtuser.type';

// This `AuthResolver` class is a GraphQL resolver that extends the `AuthRepository` class, handling authentication-related operations like signup, login, and logout

//`Resolver`: A decorator used to define a GraphQL resolver class.
@Resolver()
export class AuthResolver extends AuthRepository {
  // Defines a GraphQL query named `getUsers` that returns a list of `User` objects.
  @Query(() => User, {
    description: 'Get Current Logged In User',
  })
  async getLoggedInUser(@Ctx('user') user: User): Promise<User> {
    return user;
  }

  // Defines a GraphQL query named `getUsers` that returns a list of `User` objects.
  @Query(() => JWTToken, {
    description: 'Get JWT Token',
  })
  async getToken(@Arg('userData') userData: CreateUserDto): Promise<JWTToken> {
    return await this.getJWTToken(userData);
  }

  // `Mutation`: A decorator used to define GraphQL mutations, which are operations that modify data
  @Mutation(() => String, {
    description: 'User signup',
  })
  //`Arg`: A decorator used to inject GraphQL arguments into resolver methods.
  async signup(@Arg('userData') userData: CreateUserDto): Promise<String> {
    return `Your signup request submitted successfully. Request Id: ${await this.userSignUp(userData)}.`;
  }

  @Mutation(() => JWTUser, {
    description: 'User login',
  })
  async login(@Arg('userData') userData: UserLoginDto): Promise<JWTUser> {
    const { findUser, tokenData } = await this.userLogIn(userData);

    const jwtUser: JWTUser = {
      userId: findUser?.id,
      email: findUser?.email,
      token: tokenData.token,
      expiresIn: tokenData.expiresIn,
    };

    return jwtUser;
  }

  //  `Authorized()` : A decorator used to protect resolvers, ensuring that only authenticated users can access certain mutations or queries
  @Authorized()
  @Mutation(() => User, {
    description: 'User logout',
  })

  //`Ctx`: A decorator used to inject the GraphQL context, which often includes request-related data like the authenticated user
  async logout(@Ctx('user') userData: any): Promise<User> {
    const user = await this.userLogOut(userData.id);
    return user;
  }
}
