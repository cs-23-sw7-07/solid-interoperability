/**
 * Represents an error that occurs when reading a resource.
 */
export class ReadResourceError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
