import { URL } from "url";
import N3, { DataFactory } from "n3";
import { v4 as uuidv4 } from "uuid";
import namedNode = DataFactory.namedNode;
import literal = DataFactory.literal;
import { NotImplementedYet } from "../Errors/NotImplementedYet";
import Constructor = jest.Constructor;
import { ISocialAgent } from "./SocialAgent";

const A = namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");

export class DataInstance<T> {
  private constructor(
    public data: T,
    private owner: ISocialAgent,
    readonly id: string,
  ) {}

  static new<T>(data: T, owner: ISocialAgent) {
    return DataInstance.from(data, owner, uuidv4());
  }

  static from<T extends abstract new (...args: any) => any>(
    data: InstanceType<T>,
    owner: ISocialAgent,
    id: string,
  ) {
    return new DataInstance(data, owner, id);
  }

  get DataRegistry() {
    return new URL(`Application/${this.Name}/`, this.owner.Pod);
  }

  get Name() {
    const proto = Object.getPrototypeOf(this.data);
    const properties = Object.getOwnPropertyDescriptors(proto);
    return properties["constructor"]["value"].name;
  }

  get Serialized() {
    // Create ShapeTree from class Definitions
    const shape = {};
    const writer = new N3.Writer();
    const registryURL = new URL(this.Name + "/" + this.id, this.DataRegistry);

    writer.addQuad(namedNode(registryURL.toString()), A, literal(this.Name));

    for (const member of Object.getOwnPropertyNames(this.data)) {
      // @ts-ignore
      shape[member] = this.data[member];
      writer.addQuad(
        namedNode(registryURL.toString()),
        namedNode(member),
        // @ts-ignore
        namedNode(this.data[member]),
      );
    }

    // Create data instance RDF from object.
    let result = "";
    writer.end((e, r) => {
      if (e != undefined) {
        throw new Error("Could not serialize object.");
      }
      result = r ?? "";
    });
    return result;
  }

  static async deserialize<T extends Constructor>(
    instance: string,
    type: T,
  ): Promise<DataInstance<unknown>> {
    /*

    const parser = new N3.Parser();
    const graph = await parser.parse()

    const prototype = Object.getPrototypeOf(type)
    console.log(prototype)
    const obj = {};

    const id = "";
    const owner = new WebId(new URL(""));
    return DataInstance.from(obj, owner, id);

     */
    throw new NotImplementedYet();
  }
  static empty<T>(type: T) {
    // @ts-ignore
    return new DataInstance<T>(null);
  }
}
