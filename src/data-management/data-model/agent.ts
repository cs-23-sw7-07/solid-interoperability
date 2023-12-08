export abstract class Agent {
  protected constructor(private webID: string) {}

  getWebID(): string {
    return this.webID;
  }
}

export class SocialAgent extends Agent {
  constructor(webID: string) {
    super(webID);
  }
}

export class ApplicationAgent extends Agent {
  constructor(webID: string) {
    super(webID);
  }
}
