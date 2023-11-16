export class InvalidDate extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "InvalidDate";
  }
}
