import N3 from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../data-registration/data-registration";
import { ItoRdf } from "../../factory/ItoRdf";
import { GrantScope } from "../grant-scope";
import { AccessMode } from "../access/access-mode";
import { Rdf } from "../../rdf";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

export class DataGrant extends Rdf implements ItoRdf {
  /**
   * A class which has the fields to conform to the `Data Grant` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-grant
   */
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
    super(id, "DataGrant");
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  static makeDataGrant(argsDataGrant: Map<string, any>): DataGrant {
    return new DataGrant(
      argsDataGrant.get("id"),
      argsDataGrant.get("dataOwner"),
      argsDataGrant.get("grantee"),
      argsDataGrant.get("registeredShapeTree"),
      argsDataGrant.get("hasDataRegistration"),
      argsDataGrant.get("accessMode"),
      argsDataGrant.get("scopeOfGrant"),
      argsDataGrant.get("satisfiesAccessNeed"),
      argsDataGrant.get("hasDataInstanceIRIs"),
      argsDataGrant.get("creatorAccessMode"),
      argsDataGrant.get("inheritsFromGrant"),
    );
  }

  toRdf(writer: N3.Writer): void {
    const subjectNode = namedNode(this.id);

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
      namedNode(this.hasDataRegistration.id),
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
      this.hasDataInstanceIRIs.forEach((IRI) => {
        writer.addQuad(
          subjectNode,
          namedNode("interop:hasDataInstance"),
          namedNode(IRI),
        );
      });
    }

    if (
      this.inheritsFromGrant != undefined &&
      this.scopeOfGrant == GrantScope.Inherited
    ) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:inheritsFromGrant"),
        namedNode(this.inheritsFromGrant.id),
      );
    }
  }
}

export { AccessMode };