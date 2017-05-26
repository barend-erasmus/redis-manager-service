// Imports
import * as co from 'co';
import * as mongo from 'mongodb';
import * as redis from 'redis';

// Imports models
import { Cluster } from './../models/cluster';
import { ClusterDetails } from './../models/cluster-details';
import { Node } from './../models/node';
import { NodeDetails } from './../models/node-details';

export class ClusterService {

    constructor(private mongoUri: string) {

    }

    public list(): Promise<Cluster[]> {

        const self = this;

        return co(function*() {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.mongoUri);

            const collection: mongo.Collection = db.collection('clusters');

            const clusters: any[] = yield collection.find({}).toArray();

            db.close();

            return clusters.map((x) => new Cluster(x.name, x.nodes.map((y) => new Node(y.ipAddress, y.port))));
        });
    }

    public find(name: string): Promise<Cluster> {

        const self = this;

        return co(function*() {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.mongoUri);

            const collection: mongo.Collection = db.collection('clusters');

            const cluster: any = yield collection.findOne({
                name,
            });

            db.close();

            return new Cluster(cluster.name, cluster.nodes.map((y) => new Node(y.ipAddress, y.port)));
        });
    }

    public details(name: string): Promise<ClusterDetails> {

        const self = this;

        return co(function*() {
            const cluster: Cluster = yield self.find(name);

            let nodeDetails: NodeDetails[] = yield cluster.nodes.map((x) => self.getNodeDetails(x.ipAddress, x.port));

            nodeDetails = nodeDetails.filter((x) => x.role === 'master');

            const usedMemory = nodeDetails.length === 0 ? 0 : Math.round(nodeDetails.map((x) => x.usedMemory).reduce((a, b) => {
                return a + b;
            }) / 1000000);

            const expiredKeys = nodeDetails.length === 0 ? 0 : nodeDetails.map((x) => x.expiredKeys).reduce((a, b) => {
                return a + b;
            });

            const evictedKeys = nodeDetails.length === 0 ? 0 : nodeDetails.map((x) => x.evictedKeys).reduce((a, b) => {
                return a + b;
            });

            const connectedClients = nodeDetails.length === 0 ? 0 : nodeDetails.map((x) => x.connectedClients).reduce((a, b) => {
                return a + b;
            });

            return new ClusterDetails(usedMemory, expiredKeys, evictedKeys, connectedClients);
        });

    }

    public clear(name: string, pattern: string): Promise<boolean> {

        const self = this;

        return co(function*() {
            const cluster: Cluster = yield self.find(name);

            yield cluster.nodes.map((x) => self.clearNodeKeys(x.ipAddress, x.port, pattern));
            return true;
        });
    }

    public listKeys(name: string): Promise<string[]> {
        const self = this;

        return co(function*() {
            const cluster: Cluster = yield self.find(name);

            const keys: string[][] = yield cluster.nodes.map((x) => self.listNodeKeys(x.ipAddress, x.port, '*'));

            let arr: string[] = [];

            for (const key of keys) {
                arr = arr.concat(key);
            }

            return arr.filter((elem: string, pos: number) => {
                return arr.indexOf(elem) === pos;
            });
        });
    }

    private clearNodeKeys(ipAddress: string, port: number, pattern: string): Promise<boolean> {
        return this.listNodeKeys(ipAddress, port, pattern).then((keys: string[]) => {
            const tasks = [];

            for (const key of keys) {
                const p = new Promise((resolve: (result: boolean) => void, reject: () => void) => {

                    const redisClient: redis.RedisClient = redis.createClient({
                        host: ipAddress,
                        port,
                    });

                    redisClient.on('error', (err: Error) => {
                        resolve(false);
                        redisClient.quit();
                    });

                    redisClient.del(key, () => {
                        resolve(true);
                        redisClient.quit();
                    });
                });

                tasks.push(p);
            }

            return Promise.all(tasks);
        }).then((results: any[]) => {
            return true;
        });
    }

    private listNodeKeys(ipAddress: string, port: number, pattern: string): Promise<string[]> {
        return new Promise((resolve: (result: string[]) => void, reject: () => void) => {
            const redisClient: redis.RedisClient = redis.createClient({
                host: ipAddress,
                port,
            });

            redisClient.on('error', (err: Error) => {
                resolve(null);
                redisClient.quit();
            });

            redisClient.keys(pattern, (err: Error, keys: string[]) => {

                if (err) {
                    resolve(null);
                } else {
                    resolve(keys);
                }

                redisClient.quit();
            });
        });
    }

    private getNodeDetails(ipAddress: string, port: number): Promise<NodeDetails> {
        return new Promise((resolve: (result: NodeDetails) => void, reject: (err: Error) => void) => {
            const redisClient: redis.RedisClient = redis.createClient({
                host: ipAddress,
                port,
            });

            redisClient.on('error', (err: Error) => {
                resolve(new NodeDetails(null, 0, 0, 0, 0));

                redisClient.quit();
            });

            redisClient.info((err: Error, result: any) => {

                if (err) {
                    reject(err);
                    return;
                }

                const arr = result.split(/\r?\n/).map((x) => {
                    return {
                        key: x.split(':')[0],
                        value: x.split(':')[1],
                    };
                });

                resolve(new NodeDetails(
                    arr.filter((z) => z.key === 'role')[0].value,
                    parseFloat(arr.filter((z) => z.key === 'used_memory')[0].value),
                    parseFloat(arr.filter((z) => z.key === 'expired_keys')[0].value),
                    parseFloat(arr.filter((z) => z.key === 'evicted_keys')[0].value),
                    parseFloat(arr.filter((z) => z.key === 'connected_clients')[0].value),
                ));

                redisClient.quit();
            });
        });
    }

}
