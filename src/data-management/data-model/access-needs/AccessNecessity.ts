class AccessNecessity {
  constructor(
    public accessRequired: boolean,
    public accessOptional: boolean,
  ) {}

  generateNecessityString(): string {
    const necessityProperties = [];

    if (this.accessRequired) {
      necessityProperties.push("interop:AccessRequired");
    }
    if (this.accessOptional) {
      necessityProperties.push("interop:AccessOptional");
    }

    return necessityProperties.join(", ");
  }
}
