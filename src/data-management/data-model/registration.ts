import {Rdf} from "./rdf";
import {Agent, SocialAgent} from "./agent";

export class Registration extends Rdf {
    constructor(id: string, type: string, readonly registeredBy:SocialAgent, readonly registeredWith: Agent,
                readonly registeredAt: Date, readonly updatedAt: Date) {
        super(id, type);
    }


}