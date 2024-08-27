import { Arg, Query, Resolver } from 'type-graphql';
import { UserRepository } from '@repositories/users.repository';
import { User } from '@typedefs/users.type';

@Resolver()

// The `UserResolver` class is a GraphQL resolver that extends the `UserRepository` class. It provides several GraphQL queries and mutations for managing users
export class UserResolver extends UserRepository {
  // Defines a GraphQL query named `getUsers` that returns a list of `User` objects.
  @Query(() => [User], {
    description: 'User find list',
  })
  async getUsers(): Promise<User[]> {
    const users: User[] = await this.userFindAll();
    return users;
  }

  // Defines a GraphQL query named `getUserById` that returns a single `User` object
  @Query(() => User, {
    description: 'User find by id',
  })
  async getUserById(@Arg('userId') userId: number): Promise<User> {
    const user: User = await this.userFindById(userId);
    return user;
  }
}
