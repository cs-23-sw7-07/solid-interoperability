import N3 from "n3";
import { ItoRdf } from "./ItoRdf";
import {getRDFFromFile} from "../../Utils/get-RDF-from-file";
import {Agent, ApplicationAgent, SocialAgent} from "../agent";
import {DataAuthorization} from "../authorization/data-authorization";
import {getIdentityFromWebId} from "../../Utils/get-identity-from-web-id";
import {DataRegistration} from "../data-registration/data-registration";
import {getAccessmodeFromStr} from "../../Utils/get-accessmode-from-str";
import {getScopeOfAuthFromStr} from "../../Utils/get-scope-of-auth-from-str";
import {getDateFromStr} from "../../Utils/get-date-from-str";

/**
 * This factory is used for `RDF` creation via. the `createRdf` function.
 * It uses the `N3.writer` to create a turtle (.ttl) file.
 */
export class RdfFactory {
  private static PREFIXES = {
    prefixes: {
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      acl: "http://www.w3.org/ns/auth/acl#",
      interop: "http://www.w3.org/ns/solid/interop#",
    },
  };

  /**
   *
   * @param object is class implementing the `ItoRdf` interface
   * @param prefixes must be an object of form `{keys: 'values'}`.
   * Otherwise uses `RdfFactory.PREFIXES`
   * @returns a `Promise` which if furfulled contains a turtle file, otherwise an error which needs handling
   *
   */
  create(object: ItoRdf, prefixes?: object) {
    const finalPrefix = {
      prefixes: { ...prefixes, ...RdfFactory.PREFIXES.prefixes },
    };
    const writer = new N3.Writer(finalPrefix, { format: "Turtle" });

    return new Promise((resolve, reject) => {
      object.toRdf(writer);

      writer.end((error, result: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  parse(doc_path: string): Promise<Map<String, any>> {
    return new Promise((resolve, reject) => {
      let rdf_string: string = getRDFFromFile(doc_path)
      const parser = new N3.Parser();
      const quads: N3.Quad[] = [];
      parser.parse(
          rdf_string,
          (error, quad, _) => {
            if (error)
              reject("Could not make quads")
            if (quad)
              quads.push(quad)
            else {
              resolve(this.parse_quads(quads))
            }
          });
    })
  }

  parse_quads(quads: N3.Quad[]) {
    let args: Map<string, any> = new Map<string, any>();
    quads.forEach( async (quad) => {
      switch (quad.predicate.id) {
        case "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
          args.set("type", quad.object.id);
          args.set("id", quad.subject.id.split("/").at(-1));
          break;
        }
        case "http://www.w3.org/ns/solid/interop#grantedBy": {
          args.set("grantedBy", new SocialAgent(quad.object.id.slice(0, -3)));
          break;
        }
        case "http://www.w3.org/ns/solid/interop#grantedWith": {
          args.set("grantedWith", new ApplicationAgent(quad.object.id.slice(0, -3)));
          break;
        }
        case "http://www.w3.org/ns/solid/interop#grantedAt": {
          args.set("grantedAt", getDateFromStr(quad.object.id));
          break;
        }
        case "http://www.w3.org/ns/solid/interop#grantee": {
          args.set("grantee", new Agent(quad.object.id.slice(0, -3)));
          break;
        }
        case "http://www.w3.org/ns/solid/interop#hasAccessNeedGroup": {
          args.set("hasAccessNeedGroup", quad.object.id);
          break;
        }
        case "http://www.w3.org/ns/solid/interop#hasDataAuthorization": {
          let args_for_DataAuthorization: Map<String, any>;
          await this.parse(quad.object.id).then((result: Map<String, any>) => args_for_DataAuthorization = result);
          args.set("hasDataAuthorization", new DataAuthorization(
              args_for_DataAuthorization!.get("id"),
              args_for_DataAuthorization!.get("storedAt"),
              args_for_DataAuthorization!.get("dataOwner"),
              args_for_DataAuthorization!.get("grantee"),
              args_for_DataAuthorization!.get("registeredShapeTree"),
              args_for_DataAuthorization!.get("hasDataRegistration"),
              args_for_DataAuthorization!.get("accessMode"),
              args_for_DataAuthorization!.get("creatorAccessMode"),
              args_for_DataAuthorization!.get("scopeOfAuthorization"),
              args_for_DataAuthorization!.get("satisfiesAccessNeed"),
              args_for_DataAuthorization!.get("hasDataInstanceIRIs"),
              args_for_DataAuthorization!.get("inheritsFromAuthorization")
          ));
          break;
        }
        case "http://www.w3.org/ns/solid/interop#dataOwner": {
          args.set("dataOwner", getIdentityFromWebId(quad.object.id));
          break;
        }
        case "http://www.w3.org/ns/solid/interop#registeredShapeTree": {
          args.set("registeredShapeTree", quad.object.id);
          break;
        }
        case "http://www.w3.org/ns/solid/interop#hasDataRegistration": {
          let args_for_DataRegistration: Map<String, any>;
          await this.parse(quad.object.id).then((result: Map<String, any>) => args_for_DataRegistration = result);
          break;
        }
        case "http://www.w3.org/ns/solid/interop#accessMode": {
          if (args.has("accessMode"))
            args.get("accessMode").push(getAccessmodeFromStr(quad.object.id));
          else
            args.set("accessMode", [getAccessmodeFromStr(quad.object.id)]);
          break;
        }
        case "http://www.w3.org/ns/solid/interop#creatorAccessMode": {
          if (args.has("creatorAccessMode"))
            args.get("creatorAccessMode").push(getAccessmodeFromStr(quad.object.id));
          else
            args.set("creatorAccessMode", [getAccessmodeFromStr(quad.object.id)]);
          break;
        }
        case "http://www.w3.org/ns/solid/interop#scopeOfAuthorization": {
          args.set("scopeOfAuthorization", getScopeOfAuthFromStr(quad.object.id));
          break;
        }
        case "http://www.w3.org/ns/solid/interop#satisfiesAccessNeed": {
          args.set("satisfiesAccessNeed", quad.object.id);
          break;
        }
        case "http://www.w3.org/ns/solid/interop#registeredBy": {
          args.set("registeredBy", new SocialAgent(getIdentityFromWebId(quad.object.id)));
          break;
        }
        case "http://www.w3.org/ns/solid/interop#registeredWith": {
          args.set("registeredWith", new Agent(getIdentityFromWebId(quad.object.id)));
          break;
        }
        case "http://www.w3.org/ns/solid/interop#registeredAt": {
          args.set("registeredAt", getDateFromStr(quad.object.id));
          break;
        }
        case "http://www.w3.org/ns/solid/interop#inheritsFromAuthorization": {
          let args_for_DataAuthorization: Map<String, any>;
          await this.parse(quad.object.id).then((result: Map<String, any>) => args_for_DataAuthorization = result);
          break;
        }
        case "http://www.w3.org/ns/solid/interop#updatedAt": {
          args.set("updatedAt", getDateFromStr(quad.object.id))
          break;
        }
        default: {
          console.log(quad);
          break;
        }
      }
    })
    console.log(args);
    return args;
  }
}
