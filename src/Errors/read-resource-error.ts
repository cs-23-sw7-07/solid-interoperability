export class ReadResourceError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
