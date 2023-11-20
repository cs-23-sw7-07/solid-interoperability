import N3 from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../data-registration/data-registration";
import { ItoRdf } from "../../factory/ItoRdf";
import { GrantScope } from "../grant-scope";
import { Rdf } from "../../rdf";
import { AccessMode, DataGrant } from "./data-grant";
import { ItoDataGrant, IDataGrantBuilder } from "./dataGrantBuilder/DataGrantBuilder";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

export class DataAuthorization extends Rdf implements ItoRdf, ItoDataGrant {
  /**
   * A class which has the fields to conform to the `Data Authorization` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-authorization
   */
  dataOwner?: SocialAgent;
  grantee: Agent;
  registeredShapeTree: string; // TODO: NEED TO FINDOUT
  hasDataRegistration?: DataRegistration;
  accessMode: AccessMode[];
  creatorAccessMode?: AccessMode[];
  scopeOfAuthorization: GrantScope;
  satisfiesAccessNeed: string; // TODO: NEED TO FINDOUT
  hasDataInstanceIRIs?: string[];
  inheritsFromAuthorization?: DataAuthorization;

  constructor(
    id: string,
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
    super(id, "DataAuthorization");
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
  
  toDataGrant(builder: IDataGrantBuilder): DataGrant[] {
    throw new Error("Method not implemented.");
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  static makeDataAuthorization(
    argsForDataAuthorization: Map<string, any>,
  ): DataAuthorization {
    return new DataAuthorization(
      argsForDataAuthorization.get("id"),
      argsForDataAuthorization.get("dataOwner"),
      argsForDataAuthorization.get("grantee"),
      argsForDataAuthorization.get("registeredShapeTree"),
      argsForDataAuthorization.get("hasDataRegistration"),
      argsForDataAuthorization.get("accessMode"),
      argsForDataAuthorization.get("scopeOfAuthorization"),
      argsForDataAuthorization.get("satisfiesAccessNeed"),
      argsForDataAuthorization.get("hasDataInstanceIRIs"),
      argsForDataAuthorization.get("creatorAccessMode"),
      argsForDataAuthorization.get("inheritsFromAuthorization"),
    );
  }

  toRdf(writer: N3.Writer): void {
    const subjectNode = namedNode(this.id);

    writer.addQuad(
      subjectNode,
      namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      namedNode("interop:DataAuthorization"),
    );
    if (this.dataOwner !== undefined) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:dataOwner"),
        namedNode(this.dataOwner.getWebID()),
      );
    }
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
    if (this.hasDataRegistration !== undefined) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:hasDataRegistration"),
        namedNode(this.hasDataRegistration.id),
      );
    }

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
      this.hasDataInstanceIRIs !== undefined &&
      this.scopeOfAuthorization == GrantScope.SelectedFromRegistry
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
      this.inheritsFromAuthorization !== undefined &&
      this.scopeOfAuthorization == GrantScope.Inherited
    ) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:inheritsFromAuthorization"),
        namedNode(this.inheritsFromAuthorization.id),
      );
    }
  }
}
