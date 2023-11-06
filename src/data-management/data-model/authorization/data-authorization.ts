import N3 from "n3";
import { Agent, SocialAgent } from "../agent";
import { DataRegistration } from "../data-registration/data-registration";
import { ItoRdf } from "../factory/ItoRdf";
import { GrantScope } from "./grant-scope";
import { AccessMode } from "./access-mode";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

export class DataAuthorization implements ItoRdf {
  id: string;
  storedAt: string;
  dataOwner: SocialAgent;
  grantee: Agent;
  registeredShapeTree: string; // TODO: NEED TO FINDOUT
  hasDataRegistration: DataRegistration;
  accessMode: AccessMode[];
  creatorAccessMode?: AccessMode[];
  scopeOfAuthorization: GrantScope;
  satisfiesAccessNeed: string; // TODO: NEED TO FINDOUT
  hasDataInstanceIRIs?: string[];
  inheritsFromAuthorization?: DataAuthorization;

  constructor(
    id: string,
    storedAt: string,
    dataOwner: SocialAgent,
    grantee: Agent,
    registeredShapeTree: string,
    hasDataRegistration: DataRegistration,
    accessMode: AccessMode[],
    scopeOfAuthorization: GrantScope,
    satisfiesAccessNeed: string,
    hasDataInstanceIRIs?: string[],
    creatorAccessMode?: AccessMode[],
    inheritsFromAuthorization?: DataAuthorization,
  ) {
    this.id = id;
    this.storedAt = storedAt;
    this.dataOwner = dataOwner;
    this.grantee = grantee;
    this.registeredShapeTree = registeredShapeTree;
    this.hasDataRegistration = hasDataRegistration;
    this.accessMode = accessMode;
    this.scopeOfAuthorization = scopeOfAuthorization;
    this.satisfiesAccessNeed = satisfiesAccessNeed;
    this.hasDataInstanceIRIs = hasDataInstanceIRIs;
    this.creatorAccessMode = creatorAccessMode;
    this.inheritsFromAuthorization = inheritsFromAuthorization;
  }

  toRdf(writer: N3.Writer): void {
    const subject = `${this.storedAt}/${this.id}`;
    const subjectNode = namedNode(subject);

    writer.addQuad(
      subjectNode,
      namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      namedNode("interop:DataAuthorization"),
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
      namedNode("interop:scopeOfAuthorization"),
      namedNode(this.scopeOfAuthorization),
    );

    writer.addQuad(
      subjectNode,
      namedNode("interop:satisfiesAccessNeed"),
      namedNode(this.satisfiesAccessNeed),
    );

    if (
      this.hasDataInstanceIRIs != undefined &&
      this.scopeOfAuthorization == GrantScope.SelectedFromRegistry
    ) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:hasDataInstance"),
        writer.list(this.hasDataInstanceIRIs.map((IRI) => namedNode(IRI))),
      );
    }

    if (
      this.inheritsFromAuthorization != undefined &&
      this.scopeOfAuthorization == GrantScope.Inherited
    ) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:inheritsFromAuthorization"),
        namedNode(
          `${this.inheritsFromAuthorization.storedAt}/${this.inheritsFromAuthorization.id}`,
        ),
      );
    }
  }
}
