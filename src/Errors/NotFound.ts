export class NotFoundResource extends Error {
    constructor(msg?: string) {
        super(msg);
        this.name = "NotFoundResource";
    }
}