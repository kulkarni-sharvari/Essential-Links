import { App } from '@/app';

import { AuthResolver } from '@resolvers/auth.resolver';
import { UserResolver } from '@resolvers/users.resolver';
import { ValidateEnv } from '@utils/validateEnv';
import { TeaHarvestsResolver } from './resolvers/harvests.resolver';
import { ProcessingResolver } from './resolvers/processing.resolver';
import { ConsignmentResolver } from './resolvers/consignment.resolver';
import { TransactionResolver } from './resolvers/transaction.resolver';

ValidateEnv();

// Creates a new instance of the `App` class.
// provided resolvers will be used by the Apollo Server to handle GraphQL queries and mutations
const app = new App([AuthResolver, UserResolver, TeaHarvestsResolver, ProcessingResolver, ConsignmentResolver, TransactionResolver]);

// starts the Express server
app.listen();
