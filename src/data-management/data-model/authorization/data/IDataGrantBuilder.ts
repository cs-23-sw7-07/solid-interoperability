import { DataRegistration } from "../../data-registration/data-registration";

export interface IDataGrantBuilder {
    getAllRegistrations(): DataRegistration[]
}