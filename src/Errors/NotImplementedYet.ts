export class NotImplementedYet extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "NotImplementedYet";
  }
}
