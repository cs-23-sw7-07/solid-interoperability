import { getResource, Rdf } from "../RDF/rdf";
import { ApplicationRegistration } from "../registration";
import { Fetch } from "../../../fetch";
import {INTEROP, REGISTERED_AGENT} from "../namespace";
import { AuthorizationError } from "../../../Errors/authorizationError";
import { ResourceError } from "../../../Errors/ResourceError";
import parseLinkHeader from "parse-link-header";

export class AuthorizationAgent {
  constructor(
    private url: string,
    private fetch: Fetch,
  ) {}

  get Url(): string {
    return this.url;
  }

  async requestAccess(webId: string) {
    // Find Endpoint
    let endpoint;
    try {
      const response = await getResource(Rdf, fetch, this.url);
      endpoint = response.getObjectValueFromPredicate(
        INTEROP + "hasAuthorizationRedirectEndpoint",
      );

    } catch (e) {
      throw new Error(`Error contacting Authorization Service:\n${e}`);
    }

    if (!endpoint) throw new ResourceError("No authorization endpoint found.");

    const clientQuery = `?client_id=${encodeURIComponent(webId)}`
    endpoint += clientQuery

    // Get Access
    const wantAccess = await this.fetch(endpoint, {method: "POST", headers: {Accept:"text/turtle"}});

    if (!wantAccess.ok)
      throw new AuthorizationError("Could not authorize access.");

    const linkHeader = await fetch(this.url + clientQuery, {method:"HEAD", headers: {Accept:"text/turtle"}})
    const links = linkHeader.headers.get("Link");

    const link = parseLinkHeader(links);

    if (!link)
      throw new ResourceError(
        "No link header provided by Authorization Service.",
      );

    let accessUrl;
    try {
      const agentLink = link[REGISTERED_AGENT]
      accessUrl = agentLink?.anchor;
    }catch (e){
      throw Error("Could not get Registered Agent Link")
    }

    if (!accessUrl)
      throw Error("Registered Agent Link was undefined.")

    // Get Agent Registration url.
    // TODO: This fails without authentication.
    return getResource(ApplicationRegistration, this.fetch, accessUrl);
  }
}
