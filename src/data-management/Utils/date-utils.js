"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toXsdDateTime = void 0;
function toXsdDateTime(date) {
    return "\"".concat(date.toISOString(), "\"^^xsd:dateTime");
}
exports.toXsdDateTime = toXsdDateTime;
