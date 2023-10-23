"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataGrant = exports.GrantScope = exports.AccessMode = void 0;
var AccessMode;
(function (AccessMode) {
    AccessMode["Read"] = "acl:Read";
    AccessMode["Write"] = "acl:Write";
    AccessMode["Update"] = "acl:Update";
    AccessMode["Create"] = "acl:Create";
    AccessMode["Delete"] = "acl:Delete";
    AccessMode["Append"] = "acl:Append";
})(AccessMode || (exports.AccessMode = AccessMode = {}));
var GrantScope;
(function (GrantScope) {
    GrantScope["All"] = "interop:All";
    GrantScope["AllFromAgent"] = "interop:AllFromAgent";
    GrantScope["AllFromRegistry"] = "interop:AllFromRegistry";
    GrantScope["SelectedFromRegistry"] = "interop:SelectedFromRegistry";
    GrantScope["Inherited"] = "interop:Inherited";
})(GrantScope || (exports.GrantScope = GrantScope = {}));
var DataGrant = /** @class */ (function () {
    function DataGrant(id, storedAt, agentRegistrationIRI, dataOwner, grantee, registeredShapeTree, hasDataRegistration, accessMode, scopeOfGrant, satisfiesAccessNeed, hasDataInstanceIRIs, creatorAccessMode, inheritsFromGrant) {
        this.id = id;
        this.storedAt = storedAt;
        this.agentRegistrationIRI = agentRegistrationIRI;
        this.dataOwner = dataOwner;
        this.grantee = grantee;
        this.registeredShapeTree = registeredShapeTree;
        this.hasDataRegistration = hasDataRegistration;
        this.accessMode = accessMode;
        this.scopeOfGrant = scopeOfGrant;
        this.satisfiesAccessNeed = satisfiesAccessNeed;
        this.hasDataInstanceIRIs = hasDataInstanceIRIs;
        if (creatorAccessMode)
            this.creatorAccessMode = creatorAccessMode;
        if (inheritsFromGrant)
            this.inheritsFromGrant = inheritsFromGrant;
    }
    return DataGrant;
}());
exports.DataGrant = DataGrant;
