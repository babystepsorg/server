"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminFieldLevel = exports.isAdmin = void 0;
var isAdmin = function (_a) {
    var _b;
    var user = _a.req.user;
    // Return true or false based on if the user has an admin role
    return Boolean((_b = user === null || user === void 0 ? void 0 : user.roles) === null || _b === void 0 ? void 0 : _b.includes('admin'));
};
exports.isAdmin = isAdmin;
var isAdminFieldLevel = function (_a) {
    var _b;
    var user = _a.req.user;
    // Return true or false based on if the user has an admin role
    return Boolean((_b = user === null || user === void 0 ? void 0 : user.roles) === null || _b === void 0 ? void 0 : _b.includes('admin'));
};
exports.isAdminFieldLevel = isAdminFieldLevel;
