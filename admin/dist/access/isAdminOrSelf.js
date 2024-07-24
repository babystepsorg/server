"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminOrSelfFieldLevel = exports.isAdminOrSelf = void 0;
var isAdminOrSelf = function (_a) {
    var _b;
    var user = _a.req.user;
    // Need to be logged in
    if (user) {
        // If user has role of 'admin'
        if ((_b = user.roles) === null || _b === void 0 ? void 0 : _b.includes('admin')) {
            return true;
        }
        // If any other type of user, only provide access to themselves
        return {
            id: {
                equals: user.id,
            },
        };
    }
    // Reject everyone else
    return false;
};
exports.isAdminOrSelf = isAdminOrSelf;
var isAdminOrSelfFieldLevel = function (_a) {
    var _b;
    var user = _a.req.user, id = _a.id;
    // Return true or false based on if the user has an admin role
    if ((_b = user === null || user === void 0 ? void 0 : user.roles) === null || _b === void 0 ? void 0 : _b.includes('admin'))
        return true;
    if ((user === null || user === void 0 ? void 0 : user.id) === id)
        return true;
    return false;
};
exports.isAdminOrSelfFieldLevel = isAdminOrSelfFieldLevel;
