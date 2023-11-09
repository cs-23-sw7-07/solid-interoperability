import N3 from "n3";
import { ItoRdf } from "./ItoRdf";
import { getRDFFromPath } from "../../Utils/get-RDF";
import { ApplicationAgent, SocialAgent } from "../agent";
import { DataAuthorization } from "../authorization/data-authorization";
import { DataRegistration } from "../data-registration/data-registration";
import { getAccessmode } from "../../Utils/get-accessmode";
import { getScopeOfAuth } from "../../Utils/get-scope-of-auth";
import { getDate } from "../../Utils/get-date";
import { fetchResource } from "../../Utils/fetch-resource";
import { NotImplementedYet } from "../../../Errors/NotImplementedYet";

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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  parse(docPath: string): Promise<Map<string, any>> {
    return new Promise((resolve, reject) => {
      const rdf: string = getRDFFromPath(docPath);
      const parser = new N3.Parser();
      const quads: N3.Quad[] = [];
      parser.parse(rdf, (error, quad) => {
        if (error) {
          reject("Could not make quads: " + error + " in file: " + docPath);
        } else if (quad) {
          quads.push(quad);
        } else {
          try {
            resolve(this.parseQuads(quads));
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }

  async parseQuads(quads: N3.Quad[]): Promise<Map<string, any>> {
    const args: Map<string, any> = new Map<string, any>();
    const solidInterop: string = "http://www.w3.org/ns/solid/interop#";

    for (const quad of quads) {
      switch (quad.predicate.id) {
        case "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
          args.set("type", quad.object.id);
          args.set("id", quad.subject.id);
          break;
        }
        case solidInterop + "grantedBy": {
          args.set("grantedBy", new SocialAgent(quad.object.id));
          break;
        }
        case solidInterop + "grantedWith": {
          args.set("grantedWith", new ApplicationAgent(quad.object.id));
          break;
        }
        case solidInterop + "grantedAt": {
          args.set("grantedAt", getDate(quad.object.id));
          break;
        }
        case solidInterop + "grantee": {
          const type = (await this.parse(fetchResource())).get("type");
          if (type == solidInterop + "Application")
            args.set("grantee", new ApplicationAgent(quad.object.id));
          else if (type == solidInterop + "Agent")
            args.set("grantee", new SocialAgent(quad.object.id));
          else throw new Error("Could not infer agent type");
          break;
        }
        case solidInterop + "hasAccessNeedGroup": {
          args.set("hasAccessNeedGroup", quad.object.id);
          break;
        }
        case solidInterop + "hasDataAuthorization": {
          if (args.has("hasDataAuthorization"))
            args
              .get("hasDataAuthorization")
              .push(
                DataAuthorization.makeDataAuthorization(
                  await this.parse(quad.object.id),
                ),
              );
          else
            args.set("hasDataAuthorization", [
              DataAuthorization.makeDataAuthorization(
                await this.parse(quad.object.id),
              ),
            ]);
          break;
        }
        case solidInterop + "dataOwner": {
          args.set("dataOwner", new SocialAgent(quad.object.id));
          break;
        }
        case solidInterop + "registeredShapeTree": {
          args.set("registeredShapeTree", quad.object.id);
          break;
        }
        case solidInterop + "hasDataRegistration": {
          args.set(
            "hasDataRegistration",
            DataRegistration.makeDataRegistration(
              await this.parse(quad.object.id),
            ),
          );
          break;
        }
        case solidInterop + "accessMode": {
          if (args.has("accessMode"))
            args.get("accessMode").push(getAccessmode(quad.object.id));
          else args.set("accessMode", [getAccessmode(quad.object.id)]);
          break;
        }
        case solidInterop + "creatorAccessMode": {
          if (args.has("creatorAccessMode"))
            args.get("creatorAccessMode").push(getAccessmode(quad.object.id));
          else args.set("creatorAccessMode", [getAccessmode(quad.object.id)]);

          break;
        }
        case solidInterop + "scopeOfAuthorization": {
          args.set("scopeOfAuthorization", getScopeOfAuth(quad.object.id));
          break;
        }
        case solidInterop + "satisfiesAccessNeed": {
          args.set("satisfiesAccessNeed", quad.object.id);
          break;
        }
        case solidInterop + "registeredBy": {
          args.set("registeredBy", new SocialAgent(quad.object.id));
          break;
        }
        case solidInterop + "registeredWith": {
          args.set("registeredWith", new ApplicationAgent(quad.object.id));
          break;
        }
        case solidInterop + "registeredAt": {
          args.set("registeredAt", getDate(quad.object.id));
          break;
        }
        case solidInterop + "inheritsFromAuthorization": {
          args.set(
            "inheritsFromAuthorization",
            DataAuthorization.makeDataAuthorization(
              await this.parse(quad.object.id),
            ),
          );
          break;
        }
        case solidInterop + "updatedAt": {
          args.set("updatedAt", getDate(quad.object.id));
          break;
        }
        case solidInterop + "applicationName": {
          args.set("applicationName", quad.object.id);
          break;
        }
        case solidInterop + "applicationDescription": {
          args.set("applicationDescription", quad.object.id);
          break;
        }
        default: {
          throw new NotImplementedYet(JSON.stringify(quad, null, 4));
        }
      }
    }

    return args;
  }
}
