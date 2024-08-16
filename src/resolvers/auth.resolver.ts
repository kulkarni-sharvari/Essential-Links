import { Authorized, Arg, Ctx, Mutation, Resolver } from 'type-graphql';
// Imports a class, which defines the structure and validation for user data during signup and login
import { CreateUserDto } from '@dtos/users.dto';
// Imports a class, which contains methods for signing up, logging in, and logging out users
import { AuthRepository } from '@repositories/auth.repository';
// Imports the `User` type, which defines the structure of a user object
import { User } from '@typedefs/users.type';

// This `AuthResolver` class is a GraphQL resolver that extends the `AuthRepository` class, handling authentication-related operations like signup, login, and logout

//`Resolver`: A decorator used to define a GraphQL resolver class.
@Resolver()
export class AuthResolver extends AuthRepository {
  // `Mutation`: A decorator used to define GraphQL mutations, which are operations that modify data
  @Mutation(() => User, {
    description: 'User signup',
  })
  //`Arg`: A decorator used to inject GraphQL arguments into resolver methods.
  async signup(@Arg('userData') userData: CreateUserDto): Promise<User> {
    const user: User = await this.userSignUp(userData);
    return user;
  }

  @Mutation(() => User, {
    description: 'User login',
  })
  async login(@Arg('userData') userData: CreateUserDto): Promise<User> {
    const { findUser } = await this.userLogIn(userData);
    return findUser;
  }

  //  `Authorized()` : A decorator used to protect resolvers, ensuring that only authenticated users can access certain mutations or queries
  @Authorized()
  @Mutation(() => User, {
    description: 'User logout',
  })

  //`Ctx`: A decorator used to inject the GraphQL context, which often includes request-related data like the authenticated user
  async logout(@Ctx('user') userData: any): Promise<User> {
    const user = await this.userLogOut(userData);
    return user;
  }
}
