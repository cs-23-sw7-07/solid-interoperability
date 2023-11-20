import { SocialAgent } from "../../agent";
import { DataRegistration } from "../../data-registration/data-registration";
import { DataAuthorization } from "./data-authorization";
import { DataGrant } from "./data-grant";
import { DataInstance } from "./data-instance";

export interface IDataGrantBuilder {
  generateId(): string;
  getAllDataRegistrations(
    registeredShapeTree: string,
    dataOwner?: SocialAgent,
  ): Promise<DataRegistration[]>;
  getInheritedDataGrants(auth: DataAuthorization): Promise<DataGrant[]>;
  getDataInstances(registeredShapeTree: string): DataInstance[];
}
