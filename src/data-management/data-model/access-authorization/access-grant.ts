import { Quad } from "@rdfjs/types";
import { Writer } from "n3";
import { Agent, SocialAgent } from "../agent";
import { ItoRdf } from "../factory/ItoRdf";
import { DataGrant } from "./data-grant";

export class AccessGrant implements ItoRdf {
    id: string;
    grantedBy: SocialAgent;
    grantedAt: Date;
    grantee: Agent;
    hasAccessNeedGroup: string;
    hasDataGrant: DataGrant[];

    constructor(
        id: string,
        grantedBy: SocialAgent,
        grantedAt: Date,
        grantee: Agent,
        hasAccessNeedGroup: string,
        hasDataGrant: DataGrant[]
    ) {
        this.id = id;
        this.grantedBy = grantedBy;
        this.grantedAt = grantedAt;
        this.grantee = grantee;
        this.hasAccessNeedGroup = hasAccessNeedGroup;
        this.hasDataGrant = hasDataGrant;
    }    

    toRdf(writer: Writer<Quad>): void {
        throw new Error("Not Implemented")
    }
}