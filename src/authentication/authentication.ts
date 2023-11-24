import {URL} from "url";
import {fetch} from "solid-auth-fetcher";
import N3 from "n3";

export function authenticate() {
  return "token";
}

export async function getProfile(webId: URL) {
  // TODO: Assert that [[webId]] is a webId
  const response = await fetch(webId.toString(), {
    headers: { "Content-Type": "text/turtle" },
  });
  const profile = await response.text();

  const parser = new N3.Parser();
  return parser.parse(profile);
}

export async function getAuthAgent(webId: URL) {
  const profileGraph = await getProfile(webId);

  const authAgent = profileGraph.find(
      (x) =>
          x.predicate.value ==
          "http://www.w3.org/ns/solid/interop#hasAuthorizationAgent",
  )?.object.value;
  return authAgent;
}
