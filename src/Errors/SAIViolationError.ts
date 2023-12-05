import {Rdf} from "..";

export class SAIViolationError extends Error {
    constructor(public rdf: Rdf, message?: string) {
        super(message)
    }
}

export class SAIViolationMissingTripleError extends SAIViolationError {
    constructor(rdf: Rdf, public missingPredicate: string) {
        super(rdf, `Predicate "${missingPredicate}" is not provide, but according to the Solid Application Interoperability specification it must be specified.`)
    }
}