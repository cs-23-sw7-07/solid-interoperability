import { DatasetCore } from "@rdfjs/types";
import { DataFactory, Prefixes, Store, Writer } from "n3";

const trimNamedGraph = (dataset: DatasetCore): Store => {
  const newDataset = new Store();

  for (const q of dataset) {
    newDataset.add(
      DataFactory.quad(
        q.subject,
        q.predicate,
        q.object,
        DataFactory.defaultGraph(),
      ),
    );
  }

  return newDataset;
};

/**
 * Wrapper around N3.Writer to convert from callback style to Promise.
 * @param dataset Store with data to serialize
 * trim the named graph: If the dataset has a named graph and is not trimmed the serialization will be done in trig format instead of turtle.
 * @param prefixes Prefixes that should be included in the RDF
 */
export function serializeTurtle(
  dataset: DatasetCore,
  prefixes: Prefixes,
): Promise<string> {
  const writer = new Writer({
    format: "text/turtle",
    prefixes: { ...prefixes },
  });

  for (const quad of trimNamedGraph(dataset)) {
    writer.addQuad(quad);
  }

  return new Promise((resolve, reject) => {
    writer.end((error: Error, text: string) => {
      if (error) {
        reject(error);
      } else {
        resolve(text);
      }
    });
  });
}
