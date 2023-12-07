import { SAIViolationMissingTripleError } from "../../Errors";
import { Fetch } from "../../fetch";
import { getResource, Rdf } from "../data-model/RDF/rdf";
import { Agent, ApplicationAgent, SocialAgent } from "../data-model/agent";
import { INTEROP } from "../data-model/namespace";
import { ProfileDocument } from "../data-model/profile-documents/profile-document";
import { isApplicationAgent } from "../data-model/profile-documents/utils";

export async function getAgent(
  rdf: Rdf,
  fetch: Fetch,
  predicate: string,
): Promise<Agent> {
  const agentWebId = rdf.getObjectValueFromPredicate({ predicate: INTEROP + predicate });
  if (agentWebId) {
    const profile = await getResource(ProfileDocument, fetch, agentWebId);

    if (isApplicationAgent(profile)) return new ApplicationAgent(agentWebId);
    else return new SocialAgent(agentWebId);
  }
  throw new SAIViolationMissingTripleError(rdf, INTEROP + predicate);
}
