import {URL} from "url";

export interface ISocialAgent {
  get WebId(): URL;
  get Pod(): URL;
}

/**
 * {@link SocialAgent} represents authorized access to a social agent.
 */
export class SocialAgent implements ISocialAgent {
  readonly pod: URL;
  constructor(
    readonly webId: URL,
    pod?: URL,
  ) {
    this.pod = pod ?? new URL("https://localhost:3000");
  }

  get Pod(): URL {
    return this.pod;
  }

  get WebId(): URL {
    return this.webId;
  }
}
