export class Agent {
  identity: string;

  constructor(identity: string) {
    this.identity = identity;
  }

  getWebID(): string {
    return this.identity + "/#id";
  }
}

export class SocialAgent extends Agent {
  constructor(identity: string) {
    super(identity);
  }
}

export class ApplicationAgent extends Agent {
  constructor(identity: string) {
    super(identity);
  }
}
