export class NodeDetails {
    constructor(public role: string, public usedMemory: number, public expiredKeys: number, public evictedKeys: number, public connectedClients: number) {

    }
}