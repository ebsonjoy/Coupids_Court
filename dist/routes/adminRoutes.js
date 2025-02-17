"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../config/container");
const validatePlanDetails_1 = require("../validation/validatePlanDetails");
const adminAuth_1 = require("../middleware/adminAuth");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
const adminControllerr = container_1.container.get('AdminController');
const planController = container_1.container.get('PlanController');
const adviceController = container_1.container.get('AdviceController');
// container admin
router.post('/logoutAdmin', adminControllerr.logout);
router.post('/create', adminControllerr.register);
router.post('/login', adminControllerr.login);
router.get('/getAllUsers', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adminControllerr.getAllUsers);
router.put('/updateUserStatus/:userId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adminControllerr.updateUserStatus);
router.get('/paymentDetails', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adminControllerr.fetchPayments);
router.get('/dashBoardMasterData', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adminControllerr.getDashboardMasterData);
router.get('/dashboard/users', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adminControllerr.getUserChartData);
router.get('/dashboard/payments', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adminControllerr.getPaymentChartData);
//contaner Plan
router.get('/getAllPlans', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), planController.getPlans);
router.get('/getOnePlan/:planId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), planController.getOnePlan);
router.post('/createNewPlan', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), validatePlanDetails_1.validatePlanDetails, planController.createPlan);
router.put('/updatePlan/:planId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), planController.updatePlan);
router.put('/updatePlanStatus/:planId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), planController.updatePlanStatus);
//container Advice
//Category
router.post('/createAdviceCategory', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), upload.none(), adviceController.createAdviceCategory);
router.get('/getAdviceCategories', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adviceController.getAdviceCategory);
router.put('/blockAdviceCategory/:categoryId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adviceController.blockAdviceCategory);
router.get('/getSingleAdviceCategory/:categoryId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adviceController.getSingleAdviceCategory);
router.put('/updateAdviceCategory/:categoryId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), upload.none(), adviceController.updateAdviceCategory);
//admin imageSigned
router.post("/getSignedUrlsAdmin", adviceController.getPresignedUrl);
//Article
router.post('/createArticle', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), upload.none(), adviceController.createArticle);
router.get('/getArticles', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adviceController.getArticles);
router.put('/blockArticle/:articleId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adviceController.blockArticle);
router.get('/getSingleArticle/:articleId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adviceController.getSingleArticle);
router.put('/updateArticle/:articleId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), upload.none(), adviceController.updateArticle);
router.delete('/deleteArtilce/:articleId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adviceController.deleteArticle);
router.get('/fetchArtilceByCategory/:categoryId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adviceController.getArticlesByCategory);
//Reports
router.get('/userReportWithMessages', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adminControllerr.getUserReports);
router.put('/updateReportStatus/:reportId', adminAuth_1.adminProtect, (0, roleMiddleware_1.checkRole)(['admin']), adminControllerr.updateReportStatus);
router.post('/createPlanFeature', adminAuth_1.adminProtect, adminControllerr.createPlanFeature);
router.get('/fetchPlanFeatures', adminAuth_1.adminProtect, adminControllerr.getPlanFeatures);
exports.default = router;
