import { Rdf } from "..";

/**
 * Represents an error that occurs when there is a violation of the Solid Application Interoperability (SAI).
 */
export class SAIViolationError extends Error {
  constructor(
    public rdf: Rdf,
    message?: string,
  ) {
    super(message);
  }
}

/**
 * Represents an error that occurs when a triple is missing but required by the Solid Application Interoperability specification.
 */
export class SAIViolationMissingTripleError extends SAIViolationError {
  constructor(
    rdf: Rdf,
    public missingPredicate: string,
  ) {
    super(
      rdf,
      `Predicate "${missingPredicate}" is not provide, but according to the Solid Application Interoperability specification it must be specified.`,
    );
  }
}
