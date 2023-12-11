import { getResource, Rdf } from "../RDF/rdf";
import { ApplicationRegistration } from "../registration";
import { Fetch } from "../../../fetch";
import { INTEROP } from "../namespace";
import { AuthorizationError } from "../../../Errors/authorizationError";
import parseLinkHeader from "parse-link-header";

export class AuthorizationAgent {
  constructor(
    private url: string,
    private fetch: Fetch,
  ) {}

  get Url(): string {
    return this.url;
  }

  async requestAccess() {
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

    // Get Access
    const agentHeader = await this.fetch(endpoint);

    if (!agentHeader.ok)
      throw new AuthorizationError("Could not authorize access.");

    const linkHeader = agentHeader.headers.get("Link");

    const link = parseLinkHeader(linkHeader);
    if (!link)
      throw new ResourceError(
        "No link header provided by Authorization Service.",
      );

    // Todo: parse and handle correctly.
    const accessUrl = link.next?.url! + "/" + link.next!.anchor!;

    // Get Agent Registration url.
    return getResource(ApplicationRegistration, this.fetch, accessUrl);
  }
}
