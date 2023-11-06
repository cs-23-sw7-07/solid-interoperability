import { DataRegistration } from "./data-registration";

class DataRegistry {
  hasDataRegistration: DataRegistration[];
  constructor(hasDataRegistration: DataRegistration[]) {
    this.hasDataRegistration = hasDataRegistration;
  }
}
