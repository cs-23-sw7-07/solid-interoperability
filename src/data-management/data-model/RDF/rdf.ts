import { DataFactory, Prefixes, Quad, Store } from "n3";
import { Fetch } from "../../../fetch";
import {
  createContainer,
  deleteSPARQLUpdate,
  insertSPARQLUpdate,
  patchSPARQLUpdate,
  readParseResource,

} from "../../Utils/modify-pod";
import { TYPE_A } from "../namespace";

const { namedNode, literal } = DataFactory;

export class Rdf {
  protected dataset: Store = new Store();
  protected prefixes: Prefixes = {};

  constructor(
    readonly uri: string,
    protected fetch: Fetch,
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    if (dataset) this.dataset = dataset;
    if (prefixes) this.prefixes = prefixes;
  }

  getTypeOfSubject(): string[] | undefined {
    return this.getObjectValuesFromPredicate(
      TYPE_A,
    );
  }

  getObjectValueFromPredicate(predicate: string): string | undefined {
    const values = this.getObjectValuesFromPredicate(predicate);
    if (values && values.length == 1) {
      return values[0];
    }
    return undefined;
  }

  getObjectValuesFromPredicate(predicate: string): string[] | undefined {
    const quads = this.dataset.match(namedNode(this.uri), namedNode(predicate));
    const values: string[] = [];
    for (const quad of quads) {
      values.push(quad.object.value);
    }

    return values.length != 0 ? values : undefined;
  }

  protected createTriple(predicate: string, object: string | Date): Quad {
    return createTriple(this.uri, predicate, object);
  }

  protected createDateTriple(predicate: string, object: Date): Quad {
    return DataFactory.quad(
      namedNode(this.uri),
      namedNode(predicate),
      literal(object.toISOString(), namedNode("xsd:dateTime")),
    );
  }
  protected async update(predicate: string, updatedQuads: Quad[]) {
    await deleteSPARQLUpdate(
      this.dataset.match(namedNode(this.uri), namedNode(predicate)),
    )
      .then((body) => this.patchSPARQLUpdate(body))
      .then((res) => {
        if (!res.ok) throw new Error("Error deleting quads from resource");
        return insertSPARQLUpdate(new Store(updatedQuads));
      })
      .then((body) => this.patchSPARQLUpdate(body))
      .then((res) => {
        if (!res.ok) throw new Error("Error adding quads to resource");
        for (const quad of updatedQuads) {
          this.dataset.add(quad);
        }
      });
  }

  protected async add(quads: Quad[]): Promise<void> {
    await insertSPARQLUpdate(new Store(quads))
      .then((body) => this.patchSPARQLUpdate(body))
      .then((res) => {
        if (!res.ok) throw new Error("Error adding quads");
        for (const quad of quads) {
          this.dataset.add(quad);
        }
      });
  }

  protected async patchSPARQLUpdate(
    body: string,
    withMeta: boolean = true,
  ): Promise<Response> {
    return patchSPARQLUpdate(this.fetch, this.uri, body, withMeta);
  }
}

export async function newResource<T extends Rdf>(
    c: {
      new(uri: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes): T;
    },
    fetch: Fetch,
    uri: string,
    type: string,
    quads: Quad[],
): Promise<T> {
  const store = new Store(quads);
  store.addQuad(createTriple(uri, TYPE_A, type));

  const body = await insertSPARQLUpdate(store);
  const res = await patchSPARQLUpdate(fetch, uri, body, false);
  if (!res.ok) throw new Error("Error creating resource");
  return new c(uri, fetch, store, {});
}

export async function newResourceContainer<T extends Rdf>(
  c: {
    new (uri: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes): T;
  },
  fetch: Fetch,
  uri: string,
  type: string,
  quads: Quad[],
): Promise<T> {
  await createContainer(fetch, uri);

  const store = new Store(quads);
  store.addQuad(createTriple(uri, TYPE_A, type));

  return insertSPARQLUpdate(store)
    .then((body) => patchSPARQLUpdate(fetch, uri, body))
    .then((res) => {
      if (!res.ok) throw new Error("Error creating resource container");
      return new c(uri, fetch, store, {});
    });
}

export async function getResource<T extends Rdf>(
  c: {
    new (uri: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes): T;
  },
  fetch: Fetch,
  uri: string,
): Promise<T> {
  const url = uri + (uri.endsWith("/") ? ".meta" : "");
  const result = await readParseResource(fetch, url);
  return new c(uri, fetch, result.dataset, result.prefixes);
}

export async function getResources<T extends Rdf>(
  c: {
    new (uri: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes): T;
  },
  fetch: Fetch,
  uris: string[],
): Promise<T[]> {
  const rdfs = [];

  for (const uri of uris) {
    rdfs.push(await getResource(c, fetch, uri));
  }

  return rdfs;
}

export function createTriple(
  subject: string,
  predicate: string,
  object: string | Date,
): Quad {
  let obj;
  if (typeof object == "string") {
    obj = namedNode(object);
  } else {
    obj = literal(object.toISOString(), namedNode("xsd:dateTime"));
  }

  return DataFactory.quad(namedNode(subject), namedNode(predicate), obj);
}
