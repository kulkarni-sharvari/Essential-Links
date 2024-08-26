// Imports the `App` class that sets up and runs your Express application with integrated Apollo Server
import { App } from '@/app';

// This resolver handles authentication-related GraphQL queries and mutations.
import { AuthResolver } from '@resolvers/auth.resolver';
// This handles user-related GraphQL queries and mutations.
import { UserResolver } from '@resolvers/users.resolver';
// This validates the env variables to ensure that all required variables are set correctly
import { ValidateEnv } from '@utils/validateEnv';
import { TeaHarvestsResolver } from './resolvers/harvests.resolver';
import { ProcessingResolver } from './resolvers/processing.resolver';
import { ConsignmentResolver } from './resolvers/consignment.resolver';

ValidateEnv();

// Creates a new instance of the `App` class.
// provided resolvers will be used by the Apollo Server to handle GraphQL queries and mutations
const app = new App([AuthResolver, UserResolver, TeaHarvestsResolver, ProcessingResolver, ConsignmentResolver]);

// starts the Express server
app.listen();
