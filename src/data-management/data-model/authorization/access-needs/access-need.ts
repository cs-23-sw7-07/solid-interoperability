import {Prefixes, Store} from "n3";
import {INTEROP} from "../../namespace";
import {getResource, Rdf} from "../../RDF/rdf";
import {Fetch} from "../../../../fetch";
import {AccessMode} from "../access/access-mode";
import {getAccessmode} from "../../../Utils";

export class AccessNeed extends Rdf {
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

    get RegisteredShapeTree(): string | undefined {
        return this.getObjectValueFromPredicate(INTEROP + "registeredShapeTree");
    }

    get AccessModes(): AccessMode[] {
        const values: string[] | undefined = this.getObjectValuesFromPredicate(
            INTEROP + "accessMode",
        );
        if (values) {
            return values.map((mode) => getAccessmode(mode));
        }
        return [];
    }

    get CreatorAccessModes() {
        const values: string[] | undefined = this.getObjectValuesFromPredicate(
            INTEROP + "creatorAccessMode",
        );
        if (values) {
            return values.map((mode) => getAccessmode(mode));
        }
        return [];
    }

    get AccessNecessity(): string | undefined {
        return this.getObjectValueFromPredicate(INTEROP + "accessNecessity");
    }

    get HasDataInstance(): string[] | undefined {
        return this.getObjectValuesFromPredicate(INTEROP + "hasDataInstance");
    }

    async getInheritsFromNeed(fetch: Fetch): Promise<AccessNeed | undefined> {
        const inheritUri: string | undefined = this.getObjectValueFromPredicate(
            INTEROP + "inheritsFromNeed",
        );

        if (inheritUri) {
            return await getResource(AccessNeed, this.fetch, inheritUri);
        }
        return undefined;
    }
}
