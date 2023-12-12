/**
 * Represents an error that occurs when an invalid access mode is used.
 */
export class InvalidAccessMode extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "InvalidAccessMode";
  }
}
