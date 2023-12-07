import { INTEROP } from "../namespace";
import { Prefixes, Store } from "n3";
import { getResources } from "../RDF/rdf";
import { Fetch } from "../../../fetch";
import { AccessNeedGroup } from "../authorization/access-needs/access-need-group";
import { ProfileDocument } from "./profile-document";

export class ApplicationProfileDocument extends ProfileDocument {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  get ApplicationName(): string | undefined {
    return this.getObjectValueFromPredicate({ predicate: INTEROP + "applicationName" });
  }

  get ApplicationDescription(): string | undefined {
    return this.getObjectValueFromPredicate({ predicate: INTEROP + "applicationDescription" });
  }

  get ApplicationAuthor(): string | undefined {
    return this.getObjectValueFromPredicate({ predicate: INTEROP + "applicationAuthor" });
  }

  get ApplicationThumbnail(): string | undefined {
    return this.getObjectValueFromPredicate({ predicate: INTEROP + "applicationThumbnail" });
  }

  getHasAccessNeedGroup(): Promise<AccessNeedGroup[]> {
    const uris =
      this.getObjectValuesFromPredicate(INTEROP + "hasAccessNeedGroup") ?? [];
    return getResources(AccessNeedGroup, this.fetch, uris);
  }

  get HasAuthorizationCallbackEndpoint(): string | undefined {
    return this.getObjectValueFromPredicate(
      { predicate: INTEROP + "hasAuthorizationCallbackEndpoint" },
    );
  }
}
