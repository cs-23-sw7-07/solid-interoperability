/**
 * Error class representing a feature or functionality that is not yet implemented.
 */
export class NotImplementedYet extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "NotImplementedYet";
  }
}
