export class NotImplementedYet extends Error {
  constructor(msg: string) {
    super("Not implemented yet: " + msg);
    this.name = "NotImplementedYet";
  }
}
