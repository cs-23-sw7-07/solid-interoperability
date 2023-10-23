"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataRegistration = void 0;
var DataRegistration = /** @class */ (function () {
    function DataRegistration(id, storedAt, registeredBy, registeredWith, registeredAt, updatedAt, registeredShapeTree) {
        this.id = id;
        this.storedAt = storedAt;
        this.registeredBy = registeredBy;
        this.registeredWith = registeredWith;
        this.registeredAt = registeredAt;
        this.updatedAt = updatedAt;
        this.registeredShapeTree = registeredShapeTree;
    }
    return DataRegistration;
}());
exports.DataRegistration = DataRegistration;
