export class InvalidAccessMode extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "InvalidAccessMode";
  }
}
