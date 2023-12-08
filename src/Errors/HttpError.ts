export class HttpError extends Error {
    constructor(public httpErrorName?: string, public msg?: string, public status?: number, public errorCode?: string, public details?: object) {
        super(msg);
    }
}
