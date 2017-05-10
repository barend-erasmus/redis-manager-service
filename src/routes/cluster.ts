// Imports
import * as co from 'co';
import { Express, Request, Response } from "express";
import * as express from 'express';

// Imports configuration
import { config } from './../config';

// Imports services
import { ClusterService } from './../services/cluster';

// Imports models
import { Cluster } from './../models/cluster';
import { Node } from './../models/node';
import { ClusterDetails } from './../models/cluster-details';

export class ClusterRouter {

    private router = express.Router();

    constructor() {
        this.router.get('/list', this.list);
        this.router.get('/find', this.find);
        this.router.get('/details', this.details);
        this.router.post('/clear', this.clear);
    }

    public GetRouter() {
        return this.router;
    }

    private details(req: Request, res: Response, next: () => void) {
        co(function* () {
            const clusterService = new ClusterService(config.db.uri);

            const clusterDetails: ClusterDetails = yield clusterService.details(req.query.name);

            res.json(clusterDetails);
        });
    }

    private find(req: Request, res: Response, next: () => void) {
        co(function* () {
            const clusterService = new ClusterService(config.db.uri);

            const cluster: Cluster = yield clusterService.find(req.query.name);

            res.json(cluster);
        });
    }

    private list(req: Request, res: Response, next: () => void) {
        co(function* () {
            const clusterService = new ClusterService(config.db.uri);

            const clusters: Cluster[] = yield clusterService.list();

            res.json(clusters);
        });
    }

    private clear(req: Request, res: Response, next: () => void) {
        co(function* () {
            const clusterService = new ClusterService(config.mongoUrl);

            const result: boolean = yield clusterService.clear(req.body.name, req.body.pattern);

            res.json(result);
        });
    }
}
