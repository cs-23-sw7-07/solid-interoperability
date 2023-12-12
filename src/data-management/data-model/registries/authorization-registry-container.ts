import { Prefixes, Store } from "n3";
import { getResources, Rdf } from "../RDF/rdf";
import { Fetch } from "../../../fetch";
import { ACCESS_AUTHORIZATION } from "../namespace";
import { AccessAuthorization } from "../authorization/access";

export class AuthorizationRegistryResource extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  get AccessAuthorizations(): Promise<AccessAuthorization[]> {
    const uris = this.getObjectValuesFromPredicate(ACCESS_AUTHORIZATION) ?? [];
    return getResources(AccessAuthorization, this.fetch, uris);
  }

  async addAccessAuthorization(accessAuthorization: AccessAuthorization) {
    const quadAccess = this.createTriple(
      ACCESS_AUTHORIZATION,
      accessAuthorization.uri,
    );
    await this.add([quadAccess]);
  }
}
