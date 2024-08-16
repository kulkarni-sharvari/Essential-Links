import { join } from 'path';
// Imports `createConnection` and `ConnectionOptions` from `typeorm`, a popular ORM (Object-Relational Mapping) library for TypeScript and JavaScript
// createConnection: establish a connection to the database
// ConnectionOptions: defines the configuration for the database connection
import { createConnection, ConnectionOptions } from 'typeorm';
 // Imports the PostgreSQL connection details
import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } from '@config';

export const dbConnection = async () => {
  const dbConfig: ConnectionOptions = {
    type: 'postgres',
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    database: POSTGRES_DB,
    // TypeORM will automatically synchronize the database schema with your entities every time you start the application. 
    synchronize: true,
    logging: false,
    // Specifies the paths to the entity files (which map database tables to TypeScript classes)
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    // Specifies the paths to migration files, which are used to apply schema changes to the database
    migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
    // Specifies the paths to subscriber files, which listen to specific events in the database and trigger actions
    subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber',
    },
  };

  await createConnection(dbConfig);
};
