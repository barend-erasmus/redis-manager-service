// Imports
import * as redis from 'redis';
import * as mongodb from 'mongodb';

// Imports models
import { Cluster } from './../models/cluster';

// Imports services
import { ClusterService } from './../services/cluster';

export class NodeService {

    private clusterService: ClusterService;

    constructor(private mongoUri: string) {
        this.clusterService = new ClusterService(this.mongoUri);
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


    public key(clusterName: string, key: string): Promise<string> {
        return this.clusterService.find(clusterName).then((cluster: Cluster) => {
            return this.getNodeKey(cluster.nodes[0].ipAddress, cluster.nodes[0].port, key);
        }).then((value: string) => {
            return value;
        });
    }

    private getNodeKey(ipAddress: string, port: number, key: string): Promise<string> {
        return new Promise((resolve: Function, reject: Function) => {
            let redisClient: redis.RedisClient = redis.createClient({
                host: ipAddress,
                port: port
            });

            redisClient.on('error', (err: Error) => {
                if (err.message.startsWith('MOVED')) {
                    let ipAddressAndPort = err.message.split(' ')[2];
                    this.getNodeKey(ipAddressAndPort.split(':')[0], parseInt(ipAddressAndPort.split(':')[1]), key).then((result: string) => {
                        resolve(result);
                    });
                } else {
                    reject(err);
                }
                redisClient.quit();
            });

            redisClient.get(key, (err: Error, result: any) => {
                if (err) {
                    if (err.message.startsWith('MOVED')) {
                        let ipAddressAndPort = err.message.split(' ')[2];
                        this.getNodeKey(ipAddressAndPort.split(':')[0], parseInt(ipAddressAndPort.split(':')[1]), key).then((result: string) => {
                            resolve(result);
                        });
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(result);
                }

                redisClient.quit();
            });
        });
    }
}