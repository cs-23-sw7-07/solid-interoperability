import { SocialAgent } from "../../agent";
import { DataRegistration } from "../../registration/data-registration";
import { DataAuthorization } from "./data-authorization";
import { DataGrant } from "./data-grant";

/**
 * The `IDataGrantBuilder` interface represents a builder for creating data grants.
 * It provides methods for generating IDs, retrieving data registrations, and finding inherited data grants.
 */
export interface IDataGrantBuilder {
  /**
   * The `generateId()` function should generate a random UUID.
   * @returns A string representing the generated UUID.
   */
  generateId(): string;

  /**
   * Retrieves all data registrations in which the pod owner has access to.
   * @param registeredShapeTree - The registered shape tree.
   * @param dataOwner - Optional - The data owner of the searching data registration.
   * @returns A promise that resolves to an array of `DataRegistration` objects.
   */
  getAllDataRegistrations(
    registeredShapeTree: string,
    dataOwner?: SocialAgent,
  ): Promise<DataRegistration[]>;

  /**
   * Finds all `DataGrant` objects generated from the inherited data authorization.
   * @param auth - The inherited data authorization.
   * @returns A promise that resolves to an array of `DataGrant` objects.
   */
  getInheritedDataGrants(auth: DataAuthorization): Promise<DataGrant[]>;
}
