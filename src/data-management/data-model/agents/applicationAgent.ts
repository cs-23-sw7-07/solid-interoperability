import { Agent } from "./agent";

/**
 * Represents an application agent.
 */
export class ApplicationAgent extends Agent {
  constructor(webID: string) {
    super(webID);
  }
}
