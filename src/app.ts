import 'reflect-metadata';
import { ApolloServerPluginLandingPageProductionDefault, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { buildSchema } from 'type-graphql';
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@database';
import { AuthMiddleware, AuthCheckerMiddleware } from '@middlewares/auth.middleware';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { GetEvents } from './services/blockchain/getEvents';
import { logger, errorLogger } from '@utils/logger';
import { Publisher } from './services/publisher.service';
import { CSP_RULES } from './constants';
import { sanitizeInput } from './middlewares/sanitizeInput.middleware';
import { rateLimit } from 'express-rate-limit';

export class App {
  // public property `app` of type `express.Application, which will hold the Express instance
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(resolvers) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    // set up all middlewares
    this.initializeMiddlewares();
    // initialize the Apollo Server with the provided resolvers
    this.initApolloServer(resolvers);
    // set up error handling
    this.initializeErrorHandling();
    this.connectToDatabase();
    this.startEventListener();
    this.subscribe();
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

  private async subscribe() {
    const pub = new Publisher().getInstance();
    await pub.subscribe();
    console.log('Transaction Listener Started .......');
  }

  private async startEventListener() {
    await new GetEvents().startEventListener();
    console.log('event listener started ');
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(hpp());
    }

    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: CSP_RULES,
        },
        referrerPolicy: { policy: 'no-referrer' },
        xContentTypeOptions: false,
        xDownloadOptions: false,
        xFrameOptions: { action: 'deny' },
        xPoweredBy: false,
      }),
    );
    this.app.use(helmet.hidePoweredBy());
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    // Adds compression middleware to reduce the size of the response body
    this.app.use(compression());
    // Adds middleware to parse incoming JSON requests
    this.app.use(express.json());
    // Adds middleware to parse URL-encoded data
    this.app.use(express.urlencoded({ extended: true }));
    // Rate limiter
    // this.app.use(
    //   rateLimit({
    //     windowMs: 15 * 60 * 1000, // 15 minutes
    //     limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    //     standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    //     legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    //   }),
    // );

    // set permission-policy
    this.app.use((req, res, next) => {
      res.setHeader(
        'Permissions-Policy',
        'fullscreen=(self), microphone=(), camera=(), payment=()geolocation=(), interest-cohort=(), accelerometer=(), ambient-light-sensor=(), attribution-reporting=(), autoplay=(), bluetooth=(), browsing-topics=(), compute-pressure=(), display-capture=(), document-domain=(), encrypted-media=(), gamepad=() gyroscope=(), hid=(), identity-credentials-get(), idle-detection=(), local-fonts=(), magnetometer=(), microphone=(), midi=(),  otp-credentials(), picture-in-picture=(), publickey-credentials-create=(), publickey-credentials-get=(), screen-wake-lock=(), serial=() speaker-selection=(), storage-access=(), usb=(), web-share=(), window-management=(), xe-spatial-tracking=()',
      );
      next();
    });
  }

  // set up the Apollo Server with the provided resolvers
  private async initApolloServer(resolvers) {
    const schema = await buildSchema({
      resolvers: resolvers,
      authChecker: AuthCheckerMiddleware,
      globalMiddlewares: [sanitizeInput],
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
          return {
            status: error.extensions.exception.status,
            message: error.message,
          };
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
