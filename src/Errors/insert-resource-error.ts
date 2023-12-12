/**
 * Represents an error that occurs when inserting a resource.
 */
export class InsertResourceError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
