export class InsertResourceError extends Error {
    constructor(public message: string) {
        super(message);
    }
}