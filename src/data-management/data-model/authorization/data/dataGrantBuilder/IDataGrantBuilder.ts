import { DataRegistration } from "../../../data-registration/data-registration";

export interface IDataGrantBuilder {
    getAllDataRegistrations(): Promise<DataRegistration[] | Error>
}