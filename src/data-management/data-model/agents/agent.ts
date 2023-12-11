/**
 * Represents an abstract Agent.
 */
export abstract class Agent {
  protected constructor(private webID: string) {}

  /**
   * Gets the WebID of the agent.
   * @returns The WebID of the agent.
   */
  get WebID(): string {
    return this.webID;
  }
}
