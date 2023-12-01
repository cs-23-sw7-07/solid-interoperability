import N3 from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../data-registration/data-registration";
import { ItoRdf } from "../../factory/ItoRdf";
import { GrantScope } from "../grant-scope";
import { Rdf } from "../../rdf";
import { AccessMode, DataGrant } from "./data-grant";
import { DataInstance } from "./data-instance";
import { IDataGrantBuilder } from "./IDataGrantBuilder";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

export class DataAuthorization extends Rdf implements ItoRdf {
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
  hasDataInstanceIRIs?: DataInstance[];
  inheritsFromAuthorization?: DataAuthorization;

  constructor(
    id: string,
    grantee: Agent,
    registeredShapeTree: string,
    accessMode: AccessMode[],
    scopeOfAuthorization: GrantScope,
    satisfiesAccessNeed: string,
    dataOwner?: SocialAgent,
    hasDataRegistration?: DataRegistration,
    hasDataInstanceIRIs?: DataInstance[],
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

  async toDataGrant(builder: IDataGrantBuilder): Promise<DataGrant[]> {
    const grants: DataGrant[] = [];

    switch (this.scopeOfAuthorization) {
      case GrantScope.All:
      case GrantScope.AllFromAgent:
        for (const reg of await builder.getAllDataRegistrations(
          this.registeredShapeTree,
          this.dataOwner,
        )) {
          grants.push(
            new DataGrant(
              builder.generateId(),
              reg.registeredBy,
              this.grantee,
              this.registeredShapeTree,
              reg,
              this.accessMode,
              GrantScope.AllFromRegistry,
              this.satisfiesAccessNeed,
              undefined,
              this.creatorAccessMode,
            ),
          );
        }
        break;
      case GrantScope.AllFromRegistry:
        grants.push(
          new DataGrant(
            builder.generateId(),
            this.hasDataRegistration!.registeredBy,
            this.grantee,
            this.registeredShapeTree,
            this.hasDataRegistration!,
            this.accessMode,
            GrantScope.AllFromRegistry,
            this.satisfiesAccessNeed,
            undefined,
            this.creatorAccessMode,
          ),
        );
        break;
      case GrantScope.SelectedFromRegistry:
        grants.push(
          new DataGrant(
            builder.generateId(),
            this.dataOwner!,
            this.grantee,
            this.registeredShapeTree,
            this.hasDataRegistration!,
            this.accessMode,
            GrantScope.SelectedFromRegistry,
            this.satisfiesAccessNeed,
            this.hasDataInstanceIRIs,
            this.creatorAccessMode,
          ),
        );
        break;
      case GrantScope.Inherited:
        for (const inheritedGrant of await builder.getInheritedDataGrants(
          this,
        )) {
          grants.push(
            new DataGrant(
              builder.generateId(),
              this.hasDataRegistration!.registeredBy,
              this.grantee,
              this.hasDataRegistration!.registeredShapeTree,
              this.hasDataRegistration!,
              this.accessMode,
              GrantScope.AllFromRegistry,
              this.satisfiesAccessNeed,
              undefined,
              this.creatorAccessMode,
              inheritedGrant,
            ),
          );
        }
        break;
      default:
        throw new Error("No scope of grant is defined in the given file");
    }
    return grants;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  static makeDataAuthorization(
    argsForDataAuthorization: Map<string, any>,
  ): DataAuthorization {
    return new DataAuthorization(
      argsForDataAuthorization.get("id"),
      argsForDataAuthorization.get("grantee"),
      argsForDataAuthorization.get("registeredShapeTree"),
      argsForDataAuthorization.get("accessMode"),
      argsForDataAuthorization.get("scopeOfAuthorization"),
      argsForDataAuthorization.get("satisfiesAccessNeed"),
      argsForDataAuthorization.get("dataOwner"),
      argsForDataAuthorization.get("hasDataRegistration"),
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
    )
    console.log("hasDataRegistration: " + this.hasDataRegistration)
    if (this.hasDataRegistration != undefined) {
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
      this.hasDataInstanceIRIs.forEach((dataInstance) => {
        writer.addQuad(
          subjectNode,
          namedNode("interop:hasDataInstance"),
          namedNode(dataInstance.IRI),
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
