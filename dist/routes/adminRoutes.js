"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuthMiddleware_1 = require("../middleware/adminAuthMiddleware");
const container_1 = require("../config/container");
const validatePlanDetails_1 = require("../validation/validatePlanDetails");
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
const adminControllerr = container_1.container.get('AdminController');
const planController = container_1.container.get('PlanController');
const adviceController = container_1.container.get('AdviceController');
// container admin
router.get('/getAllUsers', adminAuthMiddleware_1.protect, adminControllerr.getAllUsers);
router.post('/login', adminControllerr.login);
router.put('/updateUserStatus/:userId', adminAuthMiddleware_1.protect, adminControllerr.updateUserStatus);
router.post('/logoutAdmin', adminControllerr.logout);
router.post('/create', adminControllerr.register);
router.get('/paymentDetails', adminAuthMiddleware_1.protect, adminControllerr.fetchPayments);
router.get('/dashBoardMasterData', adminAuthMiddleware_1.protect, adminControllerr.getDashboardMasterData);
router.get('/dashboard/users', adminAuthMiddleware_1.protect, adminControllerr.getUserChartData);
router.get('/dashboard/payments', adminAuthMiddleware_1.protect, adminControllerr.getPaymentChartData);
//contaner Plan
router.get('/getAllPlans', adminAuthMiddleware_1.protect, planController.getPlans);
router.get('/getOnePlan/:planId', adminAuthMiddleware_1.protect, planController.getOnePlan);
router.post('/createNewPlan', adminAuthMiddleware_1.protect, validatePlanDetails_1.validatePlanDetails, planController.createPlan);
router.put('/updatePlan/:planId', adminAuthMiddleware_1.protect, planController.updatePlan);
router.put('/updatePlanStatus/:planId', adminAuthMiddleware_1.protect, planController.updatePlanStatus);
//container Advice
//Category
router.post('/createAdviceCategory', adminAuthMiddleware_1.protect, multer_1.multerUploadUserImg.single("image"), adviceController.createAdviceCategory);
router.get('/getAdviceCategories', adminAuthMiddleware_1.protect, adviceController.getAdviceCategory);
router.put('/blockAdviceCategory/:categoryId', adminAuthMiddleware_1.protect, adviceController.blockAdviceCategory);
router.get('/getSingleAdviceCategory/:categoryId', adminAuthMiddleware_1.protect, adviceController.getSingleAdviceCategory);
router.put('/updateAdviceCategory/:categoryId', adminAuthMiddleware_1.protect, multer_1.multerUploadUserImg.single("image"), adviceController.updateAdviceCategory);
//Article
router.post('/createArticle', adminAuthMiddleware_1.protect, multer_1.multerUploadUserImg.single("image"), adviceController.createArticle);
router.get('/getArticles', adminAuthMiddleware_1.protect, adviceController.getArticles);
router.put('/blockArticle/:articleId', adminAuthMiddleware_1.protect, adviceController.blockArticle);
router.get('/getSingleArticle/:articleId', adminAuthMiddleware_1.protect, adviceController.getSingleArticle);
router.put('/updateArticle/:articleId', adminAuthMiddleware_1.protect, multer_1.multerUploadUserImg.single("image"), adviceController.updateArticle);
router.delete('/deleteArtilce/:articleId', adminAuthMiddleware_1.protect, adviceController.deleteArticle);
router.get('/fetchArtilceByCategory/:categoryId', adminAuthMiddleware_1.protect, adviceController.getArticlesByCategory);
router.get('/userReportWithMessages', adminAuthMiddleware_1.protect, adminControllerr.getUserReports);
router.put('/updateReportStatus/:reportId', adminAuthMiddleware_1.protect, adminControllerr.updateReportStatus);
exports.default = router;
