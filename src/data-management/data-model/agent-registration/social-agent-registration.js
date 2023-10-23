"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAgentRegistration = void 0;
var agent_registration_1 = require("./agent-registration");
var SocialAgentRegistration = /** @class */ (function (_super) {
    __extends(SocialAgentRegistration, _super);
    function SocialAgentRegistration(id, registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant, reciprocalRegistration) {
        var _this = _super.call(this, id, registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant) || this;
        _this.reciprocalRegistration = reciprocalRegistration;
        return _this;
    }
    return SocialAgentRegistration;
}(agent_registration_1.AgentRegistration));
exports.SocialAgentRegistration = SocialAgentRegistration;
