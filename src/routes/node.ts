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
import { NodeService } from './../services/node';

export class NodeRouter {

    public static status(req: Request, res: Response, next: () => void) {
        co(function*() {
            const nodeService = new NodeService(config.db.uri);

            const status: boolean = yield nodeService.status(req.query.ipAddress, req.query.port);

            res.json(status);
        });
    }

    public static getkey(req: Request, res: Response, next: () => void) {
        co(function*() {
            const nodeService = new NodeService(config.db.uri);

            const key: any = yield nodeService.key(req.query.name, req.query.key);

            res.json(key);
        });
    }
}
