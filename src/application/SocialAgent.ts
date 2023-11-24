export interface ISocialAgent {
  readonly webId: URL;
  readonly pod: URL;
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
}
