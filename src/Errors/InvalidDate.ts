/**
 * Represents an error that occurs when an invalid date is encountered.
 */
export class InvalidDate extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "InvalidDate";
  }
}
