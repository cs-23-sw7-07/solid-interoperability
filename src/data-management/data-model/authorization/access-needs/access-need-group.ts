import { INTEROP } from "../../namespace";
import { AccessNeed } from "./access-need";
import { Prefixes, Store } from "n3";
import { Rdf, getResource } from "../../RDF/rdf";
import { Fetch } from "../../../../fetch";

export class AccessNeedGroup extends Rdf {
    constructor(
        id: string,
        fetch: Fetch, 
        dataset?: Store,
        prefixes?: Prefixes,
      ) {
        super(
          id,
          fetch, dataset, prefixes
        );
      }

    get HasAccessDescriptionSet(): string[] | undefined {
        return this.getObjectValuesFromPredicate(INTEROP + "hasAccessDescriptionSet");
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
        const needUris = this.getObjectValuesFromPredicate(INTEROP + "hasAccessNeed");
        if (!needUris) return [];

        let needs: AccessNeed[] = [];
        for (const uri of needUris) {
            needs.push(await getResource(AccessNeed, this.fetch, uri));
        }

        return needs;
    }

    get Replaces(): string | undefined {
        return this.getObjectValueFromPredicate(INTEROP + "replaces");
    }
}
