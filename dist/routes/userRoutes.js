"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../config/container");
const userAuth_1 = require("../middleware/userAuth");
const userValidation_1 = __importDefault(require("../validation/userValidation"));
const multer_1 = __importDefault(require("multer"));
const checkSubscription_1 = require("../middleware/checkSubscription ");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const checkFeatureAccess_1 = require("../middleware/checkFeatureAccess");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
const userController = container_1.container.get('UserController');
//container User
router.post("/auth", userController.authUser);
router.post("/logoutUser", userController.logoutUser);
router.post("/register", userValidation_1.default, userController.registerUser);
router.post("/refresh-token", userController.refreshToken);
router.post("/verifyOtp", userController.verifyOTP);
router.post("/resendOtp", userController.resendOTP);
router.post("/password-reset-request", userController.requestPasswordReset);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/userInfoSignUp", userController.createUserInfo);
router.post("/getSignedUrls", userController.getPresignedUrl);
// Google Login
router.post('/auth/google', userController.googleAuth);
router.get("/getHomeUsersProfiles/:userId", userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.getHomeUsersProfiles);
router.get("/getUserProfile/:userId", userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.getUserProfile);
router.get('/getUserDetails/:userId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.getUserDetails);
router.put("/updatePersonalInfo/:userId", userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), upload.none(), userController.updatedPersonalInfo);
router.put("/updateDatingInfo/:userId", userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), upload.none(), userController.updateUserDatingInfo);
// Plan
router.get('/getUserPlans/:userId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.getUserPlan);
router.put('/updateUserSubscription/:userId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.updateUserSubscription);
router.get('/getUserPlanDetails/:userId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.userSubscriptionDetails);
router.put('/cancelUserPlan/:userId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.cancelSubscriptionPlan);
//LIKE
router.post('/handleHomeLikes', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), checkSubscription_1.checkSubscription, userController.handleHomeLikes);
router.get("/sentLikes/:userId", userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), (0, checkFeatureAccess_1.checkFeatureAccess)('VIEW_SENT_LIKES'), userController.getSentLikesProfiles);
router.get("/receivedLikes/:userId", userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), (0, checkFeatureAccess_1.checkFeatureAccess)('VIEW_SENT_LIKES'), userController.getReceivedLikesProfiles);
router.get('/getReceivedLikesCount/:userId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.getReceivedLikesCount);
//MATCH
router.get('/getMathProfiles/:userId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.getMathProfiles);
//ADVICE
router.get('/getAdviceCategory', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), (0, checkFeatureAccess_1.checkFeatureAccess)('READ_DATING_ADVICE'), userController.getCategories);
router.get('/getArticleByCategoryId/:categoryId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), (0, checkFeatureAccess_1.checkFeatureAccess)('READ_DATING_ADVICE'), userController.getArticleByCategoryId);
router.get('/getArticleById/:articleId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), (0, checkFeatureAccess_1.checkFeatureAccess)('READ_DATING_ADVICE'), userController.getArticleById);
//NOTIFICATION
router.post('/createNotification', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.createNotification);
router.get('/getNotifications/:userId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.getNotification);
router.delete('/clearNotifications/:userId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.clearNotifications);
// BlOCK&UNBLOCK
router.put('/userBlocked', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.userBlocked);
router.put('/userUnblocked', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.userUnBlocked);
router.get('/userBlockedList/:userId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.fetchBlockedUserList);
//REPORT
router.post('/createReport', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), userController.createReport);
router.get('/getUserPlanFeatures', userAuth_1.userProtect, userController.getUserPlanFeatures);
exports.default = router;
