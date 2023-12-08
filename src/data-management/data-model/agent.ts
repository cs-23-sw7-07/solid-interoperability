/**
 * Represents an abstract Agent.
 */
export abstract class Agent {
  protected constructor(private webID: string) {}

  /**
   * Gets the WebID of the agent.
   * @returns The WebID of the agent.
   */
  getWebID(): string {
    return this.webID;
  }
}

/**
 * Represents a social agent.
 */
export class SocialAgent extends Agent {
  constructor(webID: string) {
    super(webID);
  }
}

/**
 * Represents an application agent.
 */
export class ApplicationAgent extends Agent {
  constructor(webID: string) {
    super(webID);
  }
}
