/**
 * Represents an error indicating that a resource was not found.
 */
export class NotFoundResource extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "NotFoundResource";
  }
}
