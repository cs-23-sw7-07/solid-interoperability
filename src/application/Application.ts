import * as http from "http";
import { fetch } from "solid-auth-fetcher";
import { URL } from "url"
import { v4 as uuidv4} from "uuid"
import { NotImplementedYet } from "../Errors/NotImplementedYet";
import N3, {DataFactory} from "n3";
import namedNode = DataFactory.namedNode;
import literal = DataFactory.literal;

const A = namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type")
export interface IApplication {}

export interface ISolidDataInstance {}

export class SolidDataInstance {
  static serialize(instance: ISolidDataInstance, dataRegistry: URL) {
    const proto = Object.getPrototypeOf(instance)
    const properties = Object.getOwnPropertyDescriptors(proto)
    const name = properties["constructor"]["value"].name

    // Create ShapeTree from class Definitions
    const shape = {}
    const writer = new N3.Writer()
    const id = uuidv4()
    const registryURL = new URL(name + "/" + id, dataRegistry)

    writer.addQuad(
        namedNode(registryURL.toString()),
        A,
        literal(name)
    )


    for (const member of Object.getOwnPropertyNames(instance)){
      // @ts-ignore
      shape[member] = instance[member]
      writer.addQuad(
          namedNode(registryURL.toString()),
          namedNode(member),
          // @ts-ignore
          namedNode(instance[member])
      )
    }


    // Create data instance RDF from object.
    const obj = {

    }
    let result = ""
    writer.end((e, r) =>{
        if (e != undefined){
          throw new Error("Could not serialize object.")
        }
        result = r ?? "";
    })
    return result
  }

  static deserialize(instance: string): ISolidDataInstance {
    return {};
  }
}

export interface IAuthorization {
  get WebId(): URL;
  get DataInstances(): ISolidDataInstance[];
}

export interface IAuthService {
  request(req: RequestInfo, init?: RequestInit): Promise<Response>;
}

export class AuthService implements IAuthService {
  requestAccess(webId: URL): void {}
  queryAccess(webId: URL) {}

  request(req: RequestInfo, init?: RequestInit): Promise<Response> {
    throw new NotImplementedYet();
  }
}

export interface IAuthorizationStore {
  get Authorizations(): IAuthorization[];
  addAuthorization(auth: IAuthorization): void;
}

export class AuthorizationStore implements IAuthorizationStore {
  constructor(private auths: IAuthorization[]) {}

  get Authorizations(): IAuthorization[] {
    return this.auths;
  }

  addAuthorization(auth: IAuthorization): void {
    this.auths.push(auth);
  }
}

export class Application implements IApplication {
  constructor(
    private authService: IAuthService,
    private authenticationStore: IAuthorizationStore,
  ) {}

  async register(): Promise<void> {}

  get Authorizations(): IAuthorization[] {
    return this.authenticationStore.Authorizations;
  }

  getAuthorization(webId: URL): IAuthorization | undefined {
    return this.Authorizations.find((x) => x.WebId == webId);
  }

  store(webId: URL, data: ISolidDataInstance){
    fetch(webId.toString())
        .catch(e => {
          throw e
        })
        .then(profile => {
          profile
        })

    const pod = new URL("")
    SolidDataInstance.serialize(data, pod)
  }
}
