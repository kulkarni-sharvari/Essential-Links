// DTO: Data Transfer Object - used for validating and handling user data in a GraphQL API with the help of decorators.

// These DTOs are used to ensure that the data being passed into your GraphQL API is correctly formatted and validated before being processed further.

// Imports validation decorators from the `class-validator` library
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';

// Imports decorators from `type-graphql`
import { InputType, Field } from 'type-graphql';
import { User } from '@typedefs/users.type';

import { USER_ROLE } from '@/constants';

// InputType(): Marks a class as an input type for GraphQL, meaning it can be used as input in GraphQL queries and mutations

// Field(): Marks a class property as a GraphQL field, making it accessible in GraphQL queries and mutations

@InputType()
// the class will have fields that partially match the `User` type, though they are optional in the context of `Partial<User>`
export class CreateUserDto implements Partial<User> {
  // Marks the `email` property as a GraphQL field, meaning it can be passed as an argument in GraphQL operations
  @Field()
  //  Ensures that the `email` property is a valid email address
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEnum(USER_ROLE, { message: 'User role must be one of FARMER, PROCESSING_PLANT, SHIPMENT_COMPANY' })
  role: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  location: string;
}

// @InputType()
// export class UpdateUserDto implements Partial<User> {
//   @Field()
//   @IsString()
//   @IsNotEmpty()
//   @MinLength(9)
//   @MaxLength(32)
//   password: string;
// }

@InputType()
export class UserLoginDto implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  password: string;
}
