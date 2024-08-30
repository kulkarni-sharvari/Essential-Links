// polyfill to add ability to use metadata in TS. i,e Decorator
import 'reflect-metadata';
// generate a landing page for GraphQL queries and mutations
import { ApolloServerPluginLandingPageProductionDefault, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
//create a GraphQL server
import { ApolloServer } from 'apollo-server-express';
//compresses response bodies to reduce their size and improve performance
import compression from 'compression';
// parses cookies attached to the client request object
import cookieParser from 'cookie-parser';
// middleware, which allows you to enable Cross-Origin Resource Sharing
import cors from 'cors';
import express from 'express';
// middleware that helps secure your Express apps
import helmet from 'helmet';
// middleware, which helps prevent HTTP Parameter Pollution attacks by sanitizing query parameters
import hpp from 'hpp';
// used to build a GraphQL schema based on TypeScript classes and decorators
import { buildSchema } from 'type-graphql';
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@database';
//  custom authentication middleware
import { AuthMiddleware, AuthCheckerMiddleware } from '@middlewares/auth.middleware';
// custom error-handling middleware
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { GetEvents } from './services/blockchain/getEvents';
import { logger, errorLogger } from '@utils/logger';
import { CSP_RULES } from './constants';

export class App {
  // public property `app` of type `express.Application, which will hold the Express instance
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(resolvers) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.startEventListener();

    // set up all middlewares
    this.initializeMiddlewares();
    // initialize the Apollo Server with the provided resolvers
    this.initApolloServer(resolvers);
    // set up error handling
    this.initializeErrorHandling();
  }

  public async listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`🎮 http://localhost:${this.port}/graphql`);
      logger.info(`=================================`);
    });
  }

  // returns the Express application instance
  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    logger.info(`Database Connection status: ${await dbConnection()}`);
  }

  private async startEventListener() {
    await new GetEvents().startEventListener();
    console.log("event listener started ")
  }



  private initializeMiddlewares() {

    if (this.env === 'production') {
      this.app.use(hpp());

      this.app.use(helmet({
        contentSecurityPolicy:{
          directives:CSP_RULES
        },
        referrerPolicy:{policy:"no-referrer"},
        xContentTypeOptions: false,
        xDownloadOptions:false,
        xFrameOptions:{action:"deny"}
      }));
    }

    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    // Adds compression middleware to reduce the size of the response body
    this.app.use(compression());
    // Adds middleware to parse incoming JSON requests
    this.app.use(express.json());
    // Adds middleware to parse URL-encoded data
    this.app.use(express.urlencoded({ extended: true }));
    //TODO: (required?) Adds middleware to parse cookies
    this.app.use(cookieParser());
  }

  // set up the Apollo Server with the provided resolvers
  private async initApolloServer(resolvers) {
    const schema = await buildSchema({
      resolvers: resolvers,
      authChecker: AuthCheckerMiddleware,
    });

    // Creates a new instance of Apollo Server with the built schema
    const apolloServer = new ApolloServer({
      cache: 'bounded',
      persistedQueries: false,
      schema: schema,
      plugins: [
        this.env === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      ],
      context: async ({ req }) => {
        try {
          const user = await AuthMiddleware(req);
          //const role = user.role // added for rbac
          return { user };
        } catch (error) {
          throw new Error(error);
        }
      },
      formatResponse: (response, request) => {
        // logger(request);

        return response;
      },
      formatError: error => {
        try {
          errorLogger(error);
          return error;
        } catch (err) {
          return new Error(err);
        }
      },
    });

    // Starts the Apollo Server.
    await apolloServer.start();

    // Applies Apollo Server as middleware to the Express app, serving the GraphQL API at /graphql
    apolloServer.applyMiddleware({ app: this.app, cors: false, path: '/graphql' });
  }

  // method to set up error handling
  private initializeErrorHandling() {
    // Adds a custom error-handling middleware to the Express app
    this.app.use(ErrorMiddleware);
  }
}
