"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProtect = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const adminTokenService_1 = __importDefault(require("../utils/adminTokenService"));
const AdminModel_1 = __importDefault(require("../models/AdminModel"));
const adminProtect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminAccessToken = req.cookies.adminAccessToken;
    const adminRefreshToken = req.cookies.adminRefreshToken;
    if (adminAccessToken) {
        const decodedAccess = adminTokenService_1.default.verifyAdminAccessToken(adminAccessToken);
        if (decodedAccess) {
            req.admin = yield AdminModel_1.default.findById(decodedAccess.adminId).select('-password');
            if (req.admin)
                req.admin.role = decodedAccess.role;
            return next();
        }
    }
    if (adminRefreshToken) {
        const decodedRefresh = adminTokenService_1.default.verifyAdminRefreshToken(adminRefreshToken);
        if (decodedRefresh) {
            const admin = yield AdminModel_1.default.findById(decodedRefresh.adminId);
            if (admin) {
                const newAdminAccessToken = adminTokenService_1.default.generateAdminAccessToken(admin._id.toString(), admin.role);
                adminTokenService_1.default.setAdminTokenCookies(res, newAdminAccessToken, adminRefreshToken);
                req.admin = admin;
                if (req.admin)
                    req.admin.role = decodedRefresh.role;
                return next();
            }
        }
    }
    res.status(401);
    throw new Error('Not authorized, invalid or expired token');
}));
exports.adminProtect = adminProtect;
