import {INTEROP} from "../../namespace";
import {AccessNeed} from "./access-need";
import {Prefixes, Store} from "n3";
import {getResources, Rdf} from "../../RDF/rdf";
import {Fetch} from "../../../../fetch";

export class AccessNeedGroup extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  get HasAccessDescriptionSet(): string[] | undefined {
    return this.getObjectValuesFromPredicate(
      INTEROP + "hasAccessDescriptionSet",
    );
  }

  get AccessNecessity(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "accessNecessity");
  }

  get AccessScenario(): string[] | undefined {
    return this.getObjectValuesFromPredicate(INTEROP + "accessScenario");
  }

  get AuthenticatesAs(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "authenticatesAs");
  }

  async getHasAccessNeed(): Promise<AccessNeed[]> {
    const needUris =
      this.getObjectValuesFromPredicate(INTEROP + "hasAccessNeed") ?? [];
    return getResources(AccessNeed, this.fetch, needUris);
  }

  get Replaces(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "replaces");
  }
}
