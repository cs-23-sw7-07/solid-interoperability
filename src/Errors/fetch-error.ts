/**
 * Represents an error that occurs during a fetch operation.
 */
export class FetchError extends Error {
  constructor(message: string) {
    super(message);
  }
}
