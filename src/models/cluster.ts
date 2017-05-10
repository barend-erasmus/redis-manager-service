// Imports models
import { Node } from './node';

export class Cluster {
    constructor(public name: string, public nodes: Node[]) {

    }
}