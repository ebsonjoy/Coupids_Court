"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminTokenService {
    static generateAdminAccessToken(adminId, role) {
        return jsonwebtoken_1.default.sign({ adminId, role, adminTokenType: 'access' }, process.env.ACCESS_TOKEN_SECRET_ADMIN, { expiresIn: '15m' });
    }
    static generateAdminRefreshToken(adminId, role) {
        return jsonwebtoken_1.default.sign({ adminId, role, adminTokenType: 'refresh' }, process.env.REFRESH_TOKEN_SECRET_ADMIN, { expiresIn: '7d' });
    }
    static setAdminTokenCookies(res, adminAccessToken, adminRefreshToken) {
        res.cookie('adminAccessToken', adminAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.cookie('adminRefreshToken', adminRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
    static verifyAdminAccessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
            return decoded.adminTokenType === 'access' ? decoded : null;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    static verifyAdminRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET_ADMIN);
            return decoded.adminTokenType === 'refresh' ? decoded : null;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}
exports.default = AdminTokenService;
