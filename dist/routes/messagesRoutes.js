"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../config/container");
const userAuth_1 = require("../middleware/userAuth");
const checkSubscription_1 = require("../middleware/checkSubscription ");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
const messageController = container_1.container.get('MessageController');
router.post('/messages/:userId', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), checkSubscription_1.checkSubscription, messageController.sendMessage);
router.get('/chat-history', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), messageController.getChatHistory);
router.post('/createCallHistory', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), messageController.createCallHistroy);
router.post('/mark-message-read', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), messageController.markMessagesAsRead);
router.get('/message-unread-count', userAuth_1.userProtect, (0, roleMiddleware_1.checkRole)(['user']), messageController.getUnreadMessageCount);
exports.default = router;
