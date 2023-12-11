import {DataFactory, Prefixes, Quad, Store} from "n3";
import {Fetch} from "../../../fetch";
import {
  createContainer,
  deleteSPARQLUpdate,
  insertSPARQLUpdate,
  patchSPARQLUpdate,
  readParseResource,
} from "../../Utils/modify-pod";
import {SHAPE, TYPE_A} from "../namespace";
import {parseTurtle} from "../../turtle/turtle-parser";
import {serializeTurtle} from "../../turtle/turtle-serializer";

const { namedNode, literal } = DataFactory;

/**
 * Represents an RDF resource.
 */
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

  /**
   * Retrieves the type of the subject.
   * @returns An array of strings representing the type of the subject, or undefined if not found.
   */
  getTypeOfSubject(): string[] | undefined {
    return this.getObjectValuesFromPredicate(TYPE_A);
  }

  /**
   * Retrieves the value of an object from a given predicate.
   * @param predicate The predicate to retrieve the value from.
   * @returns The value of the object, or undefined if no value is found.
   */
  getObjectValueFromPredicate(predicate: string): string | undefined {
    const values = this.getObjectValuesFromPredicate(predicate);
    if (values && values.length == 1) {
      return values[0];
    }
    return undefined;
  }

  /**
   * Retrieves the values of the objects that match the given predicate.
   *
   * @param predicate - The predicate to match against.
   * @returns An array of string values if there are matching objects, otherwise undefined.
   */
  getObjectValuesFromPredicate(predicate: string): string[] | undefined {
    const quads = this.dataset.match(namedNode(this.uri), namedNode(predicate));
    const values: string[] = [];
    for (const quad of quads) {
      values.push(quad.object.value);
    }

    return values.length != 0 ? values : undefined;
  }

  /**
   * Creates a triple with the given predicate and object.
   * @param predicate The predicate of the triple.
   * @param object The object of the triple.
   * @returns The created triple.
   */
  protected createTriple(predicate: string, object: string | Date): Quad {
    return createTriple(this.uri, predicate, object);
  }

  /**
   * Updates the given predicate with the given quads.
   * @param predicate The predicate to update.
   * @param updatedQuads The quads to update the predicate with.
   */
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

  /**
   * Adds the given quads to the dataset. First it inserts the quads remote, and if that is successful, it adds the quads to the local dataset.
   *
   * @param quads - The quads to be added.
   * @returns A promise that resolves when the quads are successfully added.
   * @throws An error if there is an issue adding the quads.
   */
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

  /**
   * Executes a SPARQL update operation by sending a PATCH request to the specified URI.
   *
   * @param body - The SPARQL update query as a string.
   * @param withMeta - Optional parameter indicating whether to include metadata in the request.
   * @returns A Promise that resolves to a Response object representing the server's response.
   */
  protected async patchSPARQLUpdate(
    body: string,
    withMeta: boolean = true,
  ): Promise<Response> {
    return patchSPARQLUpdate(this.fetch, this.uri, body, withMeta);
  }

  get Serialized() {
    return serializeTurtle(this.dataset, this.prefixes);
  }


  get HasShape(){
    return this.getObjectValueFromPredicate(SHAPE)
  }
}

/**
 * Creates a new resource of type T and performs necessary operations to store it.
 * The type T extends the Rdf class.
 * @param c - The constructor function for the resource type T.
 * @param fetch - The fetch function used for making HTTP requests.
 * @param uri - The URI of the resource.
 * @param type - The type of the resource.
 * @param quads - The RDF quads representing the resource.
 * @returns A promise that resolves to the created resource of type T.
 * @throws An error if there is an issue creating the resource.
 */
export async function newResource<T extends Rdf>(
  c: {
    new (uri: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes): T;
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

/**
 * Creates a new resource container of type T.
 * The resource is created by first creating a new resource container, and then inserting the quads into the resource container.
 * The type T extends the Rdf class.
 * @template T - The type of the resource container.
 * @param c - The constructor function for the resource container.
 * @param fetch - The fetch function used for HTTP requests.
 * @param uri - The URI of the resource container.
 * @param type - The type of the resource container.
 * @param quads - The quads to be added to the resource container.
 * @returns {Promise<T>} - A promise that resolves to the created resource container.
 * @throws {Error} - If there is an error creating the resource container.
 */
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

/**
 * Retrieves a resource of type T from the specified URI.
 * The type T extends the Rdf class.
 *
 * @template T - The type of the resource.
 * @param c - The constructor function for creating an instance of T.
 * @param fetch - The fetch function used for making HTTP requests.
 * @param uri - The URI of the resource.
 * @returns A promise that resolves to an instance of T.
 */
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

export async function parseResource<T extends Rdf>(
  c: {
    new (uri: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes): T;
  },
  resource: string,
  source: string,
): Promise<T> {
  const result = await parseTurtle(resource, source);
  return new c(source, fetch, result.dataset, result.prefixes);
}

/**
 * Retrieves multiple resources of type T from the given URIs.
 * The type T extends the Rdf class.
 *
 * @template T - The type of the resource.
 * @param c - The constructor function for creating instances of T.
 * @param fetch - The fetch function used for making HTTP requests.
 * @param uris - The URIs of the resources to retrieve.
 * @returns A promise that resolves to an array of resources of type T.
 */
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

/**
 * Creates a triple in RDF format.
 * @param subject - The subject of the triple.
 * @param predicate - The predicate of the triple.
 * @param object - The object of the triple, which can be a string or a Date object.
 * @returns The created triple in Quad format.
 */
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
