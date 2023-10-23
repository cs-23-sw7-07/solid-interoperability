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
exports.ApplicationAgent = exports.SocialAgent = exports.Agent = void 0;
var Agent = /** @class */ (function () {
    function Agent(identity) {
        this.identity = identity;
    }
    Agent.prototype.getWebID = function () {
        return this.identity + "/#id";
    };
    return Agent;
}());
exports.Agent = Agent;
var SocialAgent = /** @class */ (function (_super) {
    __extends(SocialAgent, _super);
    function SocialAgent(identity) {
        return _super.call(this, identity) || this;
    }
    return SocialAgent;
}(Agent));
exports.SocialAgent = SocialAgent;
var ApplicationAgent = /** @class */ (function (_super) {
    __extends(ApplicationAgent, _super);
    function ApplicationAgent(identity) {
        return _super.call(this, identity) || this;
    }
    return ApplicationAgent;
}(Agent));
exports.ApplicationAgent = ApplicationAgent;
