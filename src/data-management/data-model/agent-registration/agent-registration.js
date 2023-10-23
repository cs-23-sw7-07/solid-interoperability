"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRegistration = void 0;
var AgentRegistration = /** @class */ (function () {
    function AgentRegistration(id, registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant) {
        this.id = id;
        this.registeredBy = registeredBy;
        this.registeredWith = registeredWith;
        this.registeredAt = registeredAt;
        this.updatedAt = updatedAt;
        this.registeredAgent = registeredAgent;
        this.hasAccessGrant = hasAccessGrant;
    }
    return AgentRegistration;
}());
exports.AgentRegistration = AgentRegistration;
