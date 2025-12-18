"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateRequired = validateRequired;
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePassword(password) {
    // At least 8 characters
    return password.length >= 8;
}
function validateRequired(value) {
    return value !== null && value !== undefined && value !== '';
}
//# sourceMappingURL=validators.js.map