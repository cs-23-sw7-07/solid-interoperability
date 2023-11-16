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
import { NotParsable } from "../../../Errors/NotParsable";
import { AccessGrant } from "../authorization/access-grant";
import { DataGrant } from "../authorization/data-grant";

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
  parse(docPath: string): Promise<Map<string, any> | Error> {
    return new Promise((resolve, reject) => {
      const rdf: string = getRDFFromPath(docPath);
      const parser = new N3.Parser();
      const quads: N3.Quad[] = [];
      parser.parse(rdf, (error, quad) => {
        if (error) {
          reject(
            new NotParsable(
              "Could not make quads: " + error + " in file: " + docPath,
            ),
          );
          return;
        } else if (quad) {
          quads.push(quad);
        } else {
          try {
            resolve(this.parseQuads(quads));
          } catch (e) {
            reject(e);
            return;
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
          const result: Map<string, any> | Error = await this.parse(
            fetchResource(quad.object.id),
          );
          if (result instanceof Error) {
            throw result;
          }

          switch (result.get("type")) {
            case solidInterop + "Application": {
              args.set("grantee", new ApplicationAgent(quad.object.id));
              break;
            }
            case solidInterop + "Agent": {
              args.set("grantee", new SocialAgent(quad.object.id));
              break;
            }
            default: {
              throw new Error("Could not infer agent type");
            }
          }
          break;
        }
        case solidInterop + "hasAccessNeedGroup": {
          args.set("hasAccessNeedGroup", quad.object.id);
          break;
        }
        case solidInterop + "hasDataAuthorization": {
          const result = await this.parse(quad.object.id);
          if (result instanceof Error) {
            throw result;
          }
          if (args.has("hasDataAuthorization"))
            args
              .get("hasDataAuthorization")
              .push(DataAuthorization.makeDataAuthorization(result));
          else
            args.set("hasDataAuthorization", [
              DataAuthorization.makeDataAuthorization(result),
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
          const result = await this.parse(quad.object.id);
          if (result instanceof Error) {
            throw result;
          }
          args.set(
            "hasDataRegistration",
            DataRegistration.makeDataRegistration(result),
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
          const result = await this.parse(quad.object.id);
          if (result instanceof Error) {
            throw result;
          }
          args.set(
            "inheritsFromAuthorization",
            DataAuthorization.makeDataAuthorization(result),
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
        case solidInterop + "registeredAgent": {
          args.set("registeredAgent", new ApplicationAgent(quad.object.id));
          break;
        }
        case solidInterop + "hasAccessGrant": {
          const result = await this.parse(quad.object.id);
          if (result instanceof Error) {
            throw result;
          }
          args.set("hasAccessGrant", AccessGrant.makeAccessGrant(result));
          break;
        }
        case solidInterop + "hasDataGrant": {
          const result = await this.parse(quad.object.id);
          if (result instanceof Error) {
            throw result;
          }
          if (args.has("hasDataGrant"))
            args.get("hasDataGrant").push(DataGrant.makeDataGrant(result));
          else args.set("hasDataGrant", [DataGrant.makeDataGrant(result)]);
          break;
        }
        case solidInterop + "scopeOfGrant": {
          args.set("scopeOfGrant", getScopeOfAuth(quad.object.id));
          break;
        }
        case solidInterop + "inheritsFromGrant": {
          const result = await this.parse(quad.object.id);
          if (result instanceof Error) {
            throw result;
          }
          args.set("inheritsFromGrant", DataGrant.makeDataGrant(result));
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
