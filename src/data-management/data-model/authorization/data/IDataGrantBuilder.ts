import { SocialAgent } from "../../agent";
import { DataRegistration } from "../../data-registration/data-registration";
import { DataAuthorization } from "./data-authorization";
import { DataGrant } from "./data-grant";
import { DataInstance } from "./data-instance";

export interface IDataGrantBuilder {
  /**
   * The `generateId()` function should generate a random uuid.
   */
  generateId(): string;

  /**
   * This function need to return **all** registrations in which the pod owner has access to.
   * @param registeredShapeTree
   * @param dataOwner this parameter should not be supplied if the `scopeOfGrant` is not of type `interop:All` and is of type `interop:AllFromAgent`
   */
  getAllDataRegistrations(
    registeredShapeTree: string,
    dataOwner?: SocialAgent,
  ): Promise<DataRegistration[]>;

  /**
   * This function should use the Data Authorization to find all `DataGrant(s)` from the inherited Data Authorization. \
   * This can be implemented using the `.toDataGrant` method on all `DataAuthorization` objects.
   */
  getInheritedDataGrants(auth: DataAuthorization): Promise<DataGrant[]>;
}
