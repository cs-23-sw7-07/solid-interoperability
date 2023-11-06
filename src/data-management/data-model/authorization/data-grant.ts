import N3 from "n3";
import { Agent, SocialAgent } from "../agent";
import { DataRegistration } from "../data-registration/data-registration";
import { ItoRdf } from "../factory/ItoRdf";
import { GrantScope } from "./grant-scope";
import { AccessMode } from "./access-mode";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

export class DataGrant implements ItoRdf {
  id: string;
  storedAt: string;
  agentRegistrationIRI: string;
  dataOwner: SocialAgent;
  grantee: Agent;
  registeredShapeTree: string; // TODO: NEED TO FINDOUT
  hasDataRegistration: DataRegistration;
  accessMode: AccessMode[];
  creatorAccessMode?: AccessMode[];
  scopeOfGrant: GrantScope;
  satisfiesAccessNeed: string; // TODO: NEED TO FINDOUT
  hasDataInstanceIRIs?: string[];
  inheritsFromGrant?: DataGrant;

  constructor(
    id: string,
    storedAt: string,
    agentRegistrationIRI: string,
    dataOwner: SocialAgent,
    grantee: Agent,
    registeredShapeTree: string,
    hasDataRegistration: DataRegistration,
    accessMode: AccessMode[],
    scopeOfGrant: GrantScope,
    satisfiesAccessNeed: string,
    hasDataInstanceIRIs?: string[],
    creatorAccessMode?: AccessMode[],
    inheritsFromGrant?: DataGrant,
  ) {
    this.id = id;
    this.storedAt = storedAt;
    this.agentRegistrationIRI = agentRegistrationIRI;
    this.dataOwner = dataOwner;
    this.grantee = grantee;
    this.registeredShapeTree = registeredShapeTree;
    this.hasDataRegistration = hasDataRegistration;
    this.accessMode = accessMode;
    this.scopeOfGrant = scopeOfGrant;
    this.satisfiesAccessNeed = satisfiesAccessNeed;
    this.hasDataInstanceIRIs = hasDataInstanceIRIs;
    if (creatorAccessMode) this.creatorAccessMode = creatorAccessMode;
    if (inheritsFromGrant) this.inheritsFromGrant = inheritsFromGrant;
  }

  toRdf(writer: N3.Writer): void {
    const subject = `${this.agentRegistrationIRI}/${this.id}`;
    const subjectNode = namedNode(subject);

    writer.addQuad(
      subjectNode,
      namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      namedNode("interop:DataGrant"),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:dataOwner"),
      namedNode(this.dataOwner.getWebID()),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:grantee"),
      namedNode(this.grantee.getWebID()),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:registeredShapeTree"),
      namedNode(this.registeredShapeTree),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:hasDataRegistration"),
      namedNode(
        `${this.hasDataRegistration.storedAtFolder}/${this.hasDataRegistration.id}/`,
      ),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:satisfiesAccessNeed"),
      namedNode(this.satisfiesAccessNeed),
    );

    this.accessMode.forEach((mode) => {
      writer.addQuad(
        subjectNode,
        namedNode("interop:accessMode"),
        namedNode(mode),
      );
    });

    if (this.creatorAccessMode != undefined) {
      this.creatorAccessMode.forEach((mode) => {
        writer.addQuad(
          subjectNode,
          namedNode("interop:creatorAccessMode"),
          namedNode(mode),
        );
      });
    }

    writer.addQuad(
      subjectNode,
      namedNode("interop:scopeOfGrant"),
      namedNode(this.scopeOfGrant),
    );

    if (
      this.hasDataInstanceIRIs != undefined &&
      this.scopeOfGrant == GrantScope.SelectedFromRegistry
    ) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:hasDataInstance"),
        writer.list(this.hasDataInstanceIRIs.map((IRI) => namedNode(IRI))),
      );
    }

    if (
      this.inheritsFromGrant != undefined &&
      this.scopeOfGrant == GrantScope.Inherited
    ) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:inheritsFromGrant"),
        namedNode(this.inheritsFromGrant.storedAt),
      );
    }
  }
}

export { AccessMode };
