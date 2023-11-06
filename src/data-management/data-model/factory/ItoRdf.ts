import N3 from "n3";
export interface ItoRdf {
  toRdf(writer: N3.Writer): void;
}
