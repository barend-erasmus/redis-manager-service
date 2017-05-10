// Imports
import * as redis from 'redis';
import * as mongodb from 'mongodb';

// Imports models
import {
    Node
} from './../models/node';

export class NodeService {

    constructor(private mongoUri: string) {

    }

    public status(ipAddress: string, port: number): Promise<boolean> {
        return new Promise((resolve: Function, reject: Function) => {
            let redisClient: redis.RedisClient = redis.createClient({
                host: ipAddress,
                port: port
            });

            redisClient.on('error', (err: Error) => {
                resolve(false);
                redisClient.quit();
            });

            redisClient.ping((err: Error, result: any) => {
                if (err) {
                    resolve(false);
                } else if (result == "PONG") {
                    resolve(true);
                } else {
                    resolve(false);
                }

                redisClient.quit();
            });
        });
    }
}