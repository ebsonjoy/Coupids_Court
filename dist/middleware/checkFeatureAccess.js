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
exports.checkFeatureAccess = void 0;
const User_1 = __importDefault(require("../models/User"));
const tokenService_1 = __importDefault(require("../utils/tokenService"));
const checkFeatureAccess = (featureCode) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = req.cookies.accessToken;
            if (!accessToken) {
                res.status(401).json({ message: 'Access token is missing' });
                return;
            }
            const decodedAccess = tokenService_1.default.verifyAccessToken(accessToken);
            if (!decodedAccess) {
                res.status(401).json({ message: 'Invalid or expired token' });
                return;
            }
            const user = yield User_1.default.findById(decodedAccess.userId)
                .select('-password');
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const now = new Date();
            const subscription = user.subscription;
            if (!subscription || !subscription.isPremium || !subscription.planId ||
                (subscription.planExpiryDate && new Date(subscription.planExpiryDate) <= now)) {
                res.status(403).json({
                    code: 'SUBSCRIPTION_REQUIRED',
                    message: 'This feature requires an active subscription'
                });
                return;
            }
            if (!Array.isArray(subscription.features) || !subscription.features.includes(featureCode)) {
                res.status(403).json({
                    code: 'FEATURE_NOT_INCLUDED',
                    message: 'This feature is not included in your current plan',
                });
                return;
            }
            console.log('checked feature');
            next();
        }
        catch (error) {
            console.error('Error in feature access check:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
};
exports.checkFeatureAccess = checkFeatureAccess;
