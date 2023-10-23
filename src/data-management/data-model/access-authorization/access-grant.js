"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessGrant = void 0;
var AccessGrant = /** @class */ (function () {
    function AccessGrant(id, grantedBy, grantedAt, grantee, hasAccessNeedGroup, hasDataGrant) {
        this.id = id;
        this.grantedBy = grantedBy;
        this.grantedAt = grantedAt;
        this.grantee = grantee;
        this.hasAccessNeedGroup = hasAccessNeedGroup;
        this.hasDataGrant = hasDataGrant;
    }
    return AccessGrant;
}());
exports.AccessGrant = AccessGrant;
