import N3 from "n3";

class Rdf {
  constructor(
    readonly id: string,
    readonly type: string,
  ) {}

  static async parse(graph: string): Promise<N3.Quad[]> {
    const parser = new N3.Parser();
    return parser.parse(graph);
  }

  static find(predicate: (obj: N3.Quad) => boolean, graph: N3.Quad[]) {
    return graph.find(predicate, graph);
  }
}

export { Rdf };
