// Imports
import express = require("express");

// Imports middleware
import bodyParser = require('body-parser');
import * as cors from 'cors';
import expressWinston = require('express-winston');

// Imports routes
import { ClusterRouter } from './routes/cluster';
import { NodeRouter } from './routes/node';

// Imports logger
import { logger } from './logger';

// Import configurations
let config = require('./config').config;

const argv = require('yargs').argv;

if (argv.prod) {
    config = require('./config.prod').config;
}

export class RedisManagerApi {

    constructor(private app: express.Express, private port: number) {

        this.configureMiddleware(app);
        this.configureRoutes(app);
        this.configureErrorHandling(app);
    }

    public getApp(): express.Application {
        return this.app;
    }

    public run() {
        this.app.listen(this.port);
    }

    private configureMiddleware(app: express.Express) {

        // Configure body-parser
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        // Configure CORS
        app.use(cors());

        // Configure express-winston
        app.use(expressWinston.logger({
            meta: false,
            msg: 'HTTP Request: {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
            winstonInstance: logger,
        }));

    }

    private configureRoutes(app: express.Express) {
        app.get('/api/cluster/list', ClusterRouter.list);
        app.get('/api/cluster/find', ClusterRouter.find);
        app.get('/api/cluster/details', ClusterRouter.details);
        app.post('/api/cluster/clear', ClusterRouter.clear);
        app.get('/api/cluster/listkeys', ClusterRouter.listKeys);

        app.use("/api/node/status", NodeRouter.status);
        app.use("/api/node/getkey", NodeRouter.getkey);
    }

    private configureErrorHandling(app: express.Express) {
        app.use((err: Error, req: express.Request, res: express.Response, next: () => void) => {
            logger.error(err.message);

            res.status(500).send(err.message);
        });
    }
}

const port = 3000;

const api = new RedisManagerApi(express(), port);
api.run();
logger.info(`listening on ${port}`);
