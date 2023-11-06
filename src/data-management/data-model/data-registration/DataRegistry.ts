import { DataRegistration } from "./data-registration";

export class DataRegistry {
  hasDataRegistration: DataRegistration[];
  constructor(hasDataRegistration: DataRegistration[]) {
    this.hasDataRegistration = hasDataRegistration;
  }
}
