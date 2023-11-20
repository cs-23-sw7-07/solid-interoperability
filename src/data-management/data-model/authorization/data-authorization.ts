import N3 from "n3";
import { Agent, SocialAgent } from "../agent";
import { DataRegistration } from "../data-registration/data-registration";
import { ItoRdf } from "../factory/ItoRdf";
import { GrantScope } from "./grant-scope";
import { AccessMode } from "./access-mode";
import { Rdf } from "../rdf";
import { DataGrant } from "./data-grant";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

export abstract class DataAuthorization extends Rdf implements ItoRdf {
  grantee: Agent; // shex:reference <#Agent>;
  registeredShapeTree: string; // shex:reference sts:ShapeTree;
  satisfiesAccessNeed?: string; // shex:reference <#AccessNeed>;
  accessMode: AccessMode[]; // @<#AccessModes>+
  creatorAccessMode?: AccessMode[]; // @<#AccessModes>*
  scopeOfAuthorization: GrantScope
  constructor(id: string, type: string, grantee: Agent, registeredShapeTree: string, accessMode: AccessMode[], scopeOfAuthorization: GrantScope, satisfiesAccessNeed?: string, creatorAccessMode?: AccessMode[]) {
    super(id, type)
    this.grantee = grantee;
    this.registeredShapeTree = registeredShapeTree;
    this.satisfiesAccessNeed = satisfiesAccessNeed;
    this.accessMode = accessMode;
    this.creatorAccessMode = creatorAccessMode
    this.scopeOfAuthorization = scopeOfAuthorization
  }

  abstract toDataGrant(): DataGrant[]

  toRdf(writer: N3.Writer): void {
    const subjectNode = namedNode(this.id);

    writer.addQuad(
      subjectNode,
      namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      namedNode("interop:DataAuthorization")
    );

    writer.addQuad(
      subjectNode,
      namedNode("interop:grantee"),
      namedNode(this.grantee.getWebID())
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:registeredShapeTree"),
      namedNode(this.registeredShapeTree)
    );

    this.accessMode.forEach((mode) => {
      writer.addQuad(
        subjectNode,
        namedNode("interop:accessMode"),
        namedNode(mode)
      );
    });

    if (this.creatorAccessMode != undefined) {
      this.creatorAccessMode.forEach((mode) => {
        writer.addQuad(
          subjectNode,
          namedNode("interop:creatorAccessMode"),
          namedNode(mode)
        );
      });
    }
    if (!this.satisfiesAccessNeed) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:satisfiesAccessNeed"),
        namedNode(this.satisfiesAccessNeed!)
      );
    }

    writer.addQuad(
      subjectNode,
      namedNode("interop:scopeOfAuthorization"),
      namedNode(this.scopeOfAuthorization),
    );
  }

}

export class DataAuthorizationAll extends DataAuthorization {
  constructor(
    id: string,
    grantee: Agent,
    registeredShapeTree: string,
    accessMode: AccessMode[],
    satisfiesAccessNeed?: string,
    creatorAccessMode?: AccessMode[]
  ) {
    super(id, "DataAuthorizationAll", grantee, registeredShapeTree, accessMode, GrantScope.All, satisfiesAccessNeed, creatorAccessMode);
  }

  static makeDataAuthorizationAll(
    argsForDataAuthorization: Map<string, any>
  ): DataAuthorizationAll {
    return new DataAuthorizationAll(
      argsForDataAuthorization.get("id"),
      argsForDataAuthorization.get("grantee"),
      argsForDataAuthorization.get("registeredShapeTree"),
      argsForDataAuthorization.get("accessMode"),
      argsForDataAuthorization.get("satisfiesAccessNeed"),
      argsForDataAuthorization.get("creatorAccessMode")
    );
  }

  override toRdf(writer: N3.Writer): void {
    super.toRdf(writer)
  }

  toDataGrants(id: string, data_registrations: DataRegistration[]){
    return data_registrations.map(registration => new DataGrant(id, registration.registeredBy, this.grantee, this.registeredShapeTree, registration, this.accessMode, GrantScope.AllFromRegistry, this.))

  }
}

class DataAuthorizationAllFromAgent extends DataAuthorization {
  dataOwner: SocialAgent;

  constructor(
    id: string,
    grantee: Agent,
    registeredShapeTree: string,
    accessMode: AccessMode[],
    dataOwner: SocialAgent,
    satisfiesAccessNeed?: string,
    creatorAccessMode?: AccessMode[]
  ) {
    super(id, "DataAuthorizationAllFromAgent", grantee, registeredShapeTree, accessMode, GrantScope.AllFromAgent, satisfiesAccessNeed, creatorAccessMode);
    this.dataOwner = dataOwner;
  }

  static makeDataAuthorizationAllFromAgent(
    argsForDataAuthorization: Map<string, any>
  ): DataAuthorizationAllFromAgent {
    return new DataAuthorizationAllFromAgent(
      argsForDataAuthorization.get("id"),
      argsForDataAuthorization.get("grantee"),
      argsForDataAuthorization.get("registeredShapeTree"),
      argsForDataAuthorization.get("accessMode"),
      argsForDataAuthorization.get("dataOwner"),
      argsForDataAuthorization.get("satisfiesAccessNeed"),
      argsForDataAuthorization.get("creatorAccessMode")
    );
  }

  toRdf(writer: N3.Writer): void {
    super.toRdf(writer)

    const subjectNode = namedNode(this.id);

    writer.addQuad(
      subjectNode,
      namedNode("interop:dataOwner"),
      namedNode(this.dataOwner.getWebID()),
    );
  }
}

export class DataAuthorizationAllFromRegistry extends DataAuthorization {
  dataOwner: SocialAgent;
  hasDataRegistration: DataRegistration;

  constructor(
    id: string,
    grantee: Agent,
    registeredShapeTree: string,
    accessMode: AccessMode[],
    dataOwner: SocialAgent,
    hasDataRegistration: DataRegistration,
    satisfiesAccessNeed?: string,
    creatorAccessMode?: AccessMode[]
  ) {
    super(id, "DataAuthorizationAllFromRegistry", grantee, registeredShapeTree, accessMode, GrantScope.AllFromRegistry, satisfiesAccessNeed, creatorAccessMode);
    this.dataOwner = dataOwner;
    this.hasDataRegistration = hasDataRegistration;
  }

  static makeDataAuthorizationAllFromRegistry(
    argsForDataAuthorization: Map<string, any>
  ): DataAuthorizationAllFromRegistry {
    return new DataAuthorizationAllFromRegistry(
      argsForDataAuthorization.get("id"),
      argsForDataAuthorization.get("grantee"),
      argsForDataAuthorization.get("registeredShapeTree"),
      argsForDataAuthorization.get("accessMode"),
      argsForDataAuthorization.get("dataOwner"),
      argsForDataAuthorization.get("hasDataRegistration"),
      argsForDataAuthorization.get("satisfiesAccessNeed"),
      argsForDataAuthorization.get("creatorAccessMode")
    );
  }

  override toRdf(writer: N3.Writer): void {
    super.toRdf(writer)

    const subjectNode = namedNode(this.id);

    writer.addQuad(
      subjectNode,
      namedNode("interop:dataOwner"),
      namedNode(this.dataOwner.getWebID()),
    );

    if (this.hasDataRegistration) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:hasDataRegistration"),
        namedNode(this.hasDataRegistration.id),
      );
    }
  }
}

export class DataAuthorizationSelectedFromRegistry extends DataAuthorization {
  dataOwner: SocialAgent;
  hasDataRegistration: DataRegistration;
  hasDataInstanceIRIs: string[];

  constructor(
    id: string,
    grantee: Agent,
    registeredShapeTree: string,
    accessMode: AccessMode[],
    dataOwner: SocialAgent,
    hasDataRegistration: DataRegistration,
    hasDataInstanceIRIs: string[],
    satisfiesAccessNeed?: string,
    creatorAccessMode?: AccessMode[]
  ) {
    super(id, "DataAuthorizationSelectedFromRegistry", grantee, registeredShapeTree, accessMode, GrantScope.SelectedFromRegistry, satisfiesAccessNeed, creatorAccessMode);
    this.dataOwner = dataOwner;
    this.hasDataRegistration = hasDataRegistration;
    this.hasDataInstanceIRIs = hasDataInstanceIRIs;
  }

  static makeDataAuthorizationSelectedFromRegistry(
    argsForDataAuthorization: Map<string, any>
  ): DataAuthorizationSelectedFromRegistry {
    return new DataAuthorizationSelectedFromRegistry(
      argsForDataAuthorization.get("id"),
      argsForDataAuthorization.get("grantee"),
      argsForDataAuthorization.get("registeredShapeTree"),
      argsForDataAuthorization.get("accessMode"),
      argsForDataAuthorization.get("dataOwner"),
      argsForDataAuthorization.get("hasDataRegistration"),
      argsForDataAuthorization.get("hasDataInstanceIRIs"),
      argsForDataAuthorization.get("satisfiesAccessNeed"),
      argsForDataAuthorization.get("creatorAccessMode")
    );
  }

  override toRdf(writer: N3.Writer): void {
    super.toRdf(writer)

    const subjectNode = namedNode(this.id);

    writer.addQuad(
      subjectNode,
      namedNode("interop:dataOwner"),
      namedNode(this.dataOwner.getWebID()),
    );

    if (this.hasDataRegistration) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:hasDataRegistration"),
        namedNode(this.hasDataRegistration.id),
      );
    }


    if (
      this.hasDataInstanceIRIs != undefined &&
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
  }
}

export class DataAuthorizationInherited extends DataAuthorization {
  dataOwner: SocialAgent;
  hasDataRegistration?: DataRegistration;
  inheritsFromAuthorization: DataAuthorization;

  constructor(
    id: string,
    grantee: Agent,
    registeredShapeTree: string,
    accessMode: AccessMode[],
    dataOwner: SocialAgent,
    inheritsFromAuthorization: DataAuthorization,
    hasDataRegistration?: DataRegistration,
    satisfiesAccessNeed?: string,
    creatorAccessMode?: AccessMode[]
  ) {
    super(id, "DataAuthorizationInherited", grantee, registeredShapeTree, accessMode, GrantScope.Inherited, satisfiesAccessNeed, creatorAccessMode);
    this.dataOwner = dataOwner;
    this.inheritsFromAuthorization = inheritsFromAuthorization;
    this.hasDataRegistration = hasDataRegistration;
  }

  static makeDataAuthorizationInherited(
    argsForDataAuthorization: Map<string, any>
  ): DataAuthorizationInherited {
    return new DataAuthorizationInherited(
      argsForDataAuthorization.get("id"),
      argsForDataAuthorization.get("grantee"),
      argsForDataAuthorization.get("registeredShapeTree"),
      argsForDataAuthorization.get("accessMode"),
      argsForDataAuthorization.get("dataOwner"),
      argsForDataAuthorization.get("inheritsFromAuthorization"),
      argsForDataAuthorization.get("hasDataRegistration"),
      argsForDataAuthorization.get("satisfiesAccessNeed"),
      argsForDataAuthorization.get("creatorAccessMode")
    );
  }

  override toRdf(writer: N3.Writer): void {
    super.toRdf(writer)

    const subjectNode = namedNode(this.id);

    writer.addQuad(
      subjectNode,
      namedNode("interop:dataOwner"),
      namedNode(this.dataOwner.getWebID()),
    );

    if (this.hasDataRegistration) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:hasDataRegistration"),
        namedNode(this.hasDataRegistration.id),
      );
    }

    if (
      this.inheritsFromAuthorization != undefined &&
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
