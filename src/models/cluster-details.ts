export class ClusterDetails {
    constructor(public usedMemory: number, public expiredKeys: number, public evictedKeys: number, public connectedClients: number) {

    }
}