/**
 * Represents an error that occurs when a value cannot be parsed.
 */
export class NotParsable extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "NotParsable";
  }
}
