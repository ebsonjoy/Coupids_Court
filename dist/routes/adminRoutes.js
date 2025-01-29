"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../config/container");
const validatePlanDetails_1 = require("../validation/validatePlanDetails");
const adminAuth_1 = require("../middleware/adminAuth");
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
router.get('/getAllUsers', adminAuth_1.adminProtect, adminControllerr.getAllUsers);
router.put('/updateUserStatus/:userId', adminAuth_1.adminProtect, adminControllerr.updateUserStatus);
router.get('/paymentDetails', adminAuth_1.adminProtect, adminControllerr.fetchPayments);
router.get('/dashBoardMasterData', adminAuth_1.adminProtect, adminControllerr.getDashboardMasterData);
router.get('/dashboard/users', adminAuth_1.adminProtect, adminControllerr.getUserChartData);
router.get('/dashboard/payments', adminAuth_1.adminProtect, adminControllerr.getPaymentChartData);
//contaner Plan
router.get('/getAllPlans', adminAuth_1.adminProtect, planController.getPlans);
router.get('/getOnePlan/:planId', adminAuth_1.adminProtect, planController.getOnePlan);
router.post('/createNewPlan', adminAuth_1.adminProtect, validatePlanDetails_1.validatePlanDetails, planController.createPlan);
router.put('/updatePlan/:planId', adminAuth_1.adminProtect, planController.updatePlan);
router.put('/updatePlanStatus/:planId', adminAuth_1.adminProtect, planController.updatePlanStatus);
//container Advice
//Category
router.post('/createAdviceCategory', adminAuth_1.adminProtect, upload.none(), adviceController.createAdviceCategory);
router.get('/getAdviceCategories', adminAuth_1.adminProtect, adviceController.getAdviceCategory);
router.put('/blockAdviceCategory/:categoryId', adminAuth_1.adminProtect, adviceController.blockAdviceCategory);
router.get('/getSingleAdviceCategory/:categoryId', adminAuth_1.adminProtect, adviceController.getSingleAdviceCategory);
router.put('/updateAdviceCategory/:categoryId', adminAuth_1.adminProtect, upload.none(), adviceController.updateAdviceCategory);
//admin imageSigned
router.post("/getSignedUrlsAdmin", adviceController.getPresignedUrl);
//Article
router.post('/createArticle', adminAuth_1.adminProtect, upload.none(), adviceController.createArticle);
router.get('/getArticles', adminAuth_1.adminProtect, adviceController.getArticles);
router.put('/blockArticle/:articleId', adminAuth_1.adminProtect, adviceController.blockArticle);
router.get('/getSingleArticle/:articleId', adminAuth_1.adminProtect, adviceController.getSingleArticle);
router.put('/updateArticle/:articleId', adminAuth_1.adminProtect, upload.none(), adviceController.updateArticle);
router.delete('/deleteArtilce/:articleId', adminAuth_1.adminProtect, adviceController.deleteArticle);
router.get('/fetchArtilceByCategory/:categoryId', adminAuth_1.adminProtect, adviceController.getArticlesByCategory);
//Reports
router.get('/userReportWithMessages', adminAuth_1.adminProtect, adminControllerr.getUserReports);
router.put('/updateReportStatus/:reportId', adminAuth_1.adminProtect, adminControllerr.updateReportStatus);
exports.default = router;
