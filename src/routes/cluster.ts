// Imports
import * as co from 'co';
import { Express, Request, Response } from "express";
import * as express from 'express';

// Import configurations
let config = require('./../config').config;

const argv = require('yargs').argv;

if (argv.prod) {
    config = require('./../config.prod').config;
}

// Imports services
import { ClusterService } from './../services/cluster';

// Imports models
import { Cluster } from './../models/cluster';
import { ClusterDetails } from './../models/cluster-details';
import { Node } from './../models/node';

export class ClusterRouter {


    public static details(req: Request, res: Response, next: () => void) {
        co(function* () {
            const clusterService = new ClusterService(config.db.uri);

            const clusterDetails: ClusterDetails = yield clusterService.details(req.query.name);

            res.json(clusterDetails);
        });
    }

    public static find(req: Request, res: Response, next: () => void) {
        co(function* () {
            const clusterService = new ClusterService(config.db.uri);

            const cluster: Cluster = yield clusterService.find(req.query.name);

            res.json(cluster);
        });
    }

    public static list(req: Request, res: Response, next: () => void) {
        co(function* () {
            const clusterService = new ClusterService(config.db.uri);

            const clusters: Cluster[] = yield clusterService.list();

            res.json(clusters);
        });
    }

    public static listKeys(req: Request, res: Response, next: () => void) {
        co(function* () {
            const clusterService = new ClusterService(config.db.uri);

            const keys: string[] = yield clusterService.listKeys(req.query.name);

            res.json(keys);
        });
    }

    public static clear(req: Request, res: Response, next: () => void) {
        co(function* () {
            const clusterService = new ClusterService(config.db.uri);

            const result: boolean = yield clusterService.clear(req.body.name, req.body.pattern);

            res.json(result);
        });
    }
}
