import { IDataGrantBuilder } from "./IDataGrantBuilder";
import { DataGrant } from "./data-grant";

export interface ItoDataGrant {
    toDataGrant(builder: IDataGrantBuilder): DataGrant[]
}