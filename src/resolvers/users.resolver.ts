import { Arg, Mutation, Query, Resolver } from 'type-graphql';
// Import a classes which define the structure and validation rules for creating and updating user data.
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
// Imports the `UserRepository` class, which contains methods for interacting with the user data in the database
import { UserRepository } from '@repositories/users.repository';
// Imports the `User` type, which defines the structure of a user object in the system
import { User } from '@typedefs/users.type';

@Resolver()
// makes the below class as GraphQL resolver.

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

  // Defines a GraphQL mutation named `createUser` that returns a `User` object.
  @Mutation(() => User, {
    description: 'User create',
  })
  async createUser(@Arg('userData') userData: CreateUserDto): Promise<User> {
    const user: User = await this.userCreate(userData);
    return user;
  }

  // Defines a GraphQL mutation named `updateUser` that returns a `User` object.
  @Mutation(() => User, {
    description: 'User update',
  })
  async updateUser(@Arg('userId') userId: number, @Arg('userData') userData: UpdateUserDto): Promise<User> {
    const user: User = await this.userUpdate(userId, userData);
    return user;
  }
  // Defines a GraphQL mutation named `deleteUser` that returns a `User` object
  @Mutation(() => User, {
    description: 'User delete',
  })
  async deleteUser(@Arg('userId') userId: number): Promise<User> {
    const user: User = await this.userDelete(userId);
    return user;
  }
}
