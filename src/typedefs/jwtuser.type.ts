import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class JWTUser {
  @Field()
  userId: number;
  @Field()
  email: string;
  @Field()
  token: string;
  @Field()
  expiresIn: number;
}

@ObjectType()
export class JWTToken {
  @Field()
  token: string;
  @Field()
  expiresIn: number;
}
