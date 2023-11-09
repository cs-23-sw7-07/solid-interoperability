export class NotParsable extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "NotParsable";
  }
}
