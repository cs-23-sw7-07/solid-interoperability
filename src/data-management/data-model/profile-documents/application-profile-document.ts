import { INTEROP } from "../namespace";
import { Prefixes, Store } from "n3";
import { getResource } from "../RDF/rdf";
import { Fetch } from "../../../fetch";
import { AccessNeedGroup } from "../authorization/access-needs/access-need-group";
import { ProfileDocument } from "./profile-document";

export class ApplicationProfileDocument extends ProfileDocument {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  get ApplicationName(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "applicationName");
  }

  get ApplicationDescription(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "applicationDescription");
  }

  get ApplicationAuthor(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "applicationAuthor");
  }

  get ApplicationThumbnail(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "applicationThumbnail");
  }

  async getHasAccessNeedGroup(): Promise<AccessNeedGroup[]> {
    const values = this.getObjectValuesFromPredicate(
      INTEROP + "hasAccessNeedGroup",
    );

    if (!values) return [];

    let groups = [];
    for (const uri of values) {
      groups.push(await getResource(AccessNeedGroup, this.fetch, uri));
    }

    return groups;
  }

  get HasAuthorizationCallbackEndpoint(): string | undefined {
    return this.getObjectValueFromPredicate(
      INTEROP + "hasAuthorizationCallbackEndpoint",
    );
  }
}
