"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusMessage = void 0;
var StatusMessage;
(function (StatusMessage) {
    StatusMessage["SUCCESS"] = "Operation successful";
    StatusMessage["CREATED_SUCCESS"] = "Resource created successfully";
    StatusMessage["BAD_REQUEST"] = "Bad request, please check the input data";
    StatusMessage["UNAUTHORIZED"] = "Unauthorized access";
    StatusMessage["FORBIDDEN"] = "Access forbidden";
    StatusMessage["NOT_FOUND"] = "Resource not found";
    StatusMessage["INTERNAL_SERVER_ERROR"] = "An internal server error occurred";
    StatusMessage["INVALID_CREDENTIALS"] = "Invalid credentials provided";
    StatusMessage["EMAIL_ALREADY_EXISTS"] = "An account with this email already exists";
    StatusMessage["PASSWORD_TOO_WEAK"] = "Password does not meet strength requirements";
    StatusMessage["TOKEN_EXPIRED"] = "The token has expired, please request a new one";
    StatusMessage["RESOURCE_NOT_AVAILABLE"] = "Requested resource is currently unavailable";
    StatusMessage["OPERATION_FAILED"] = "The operation could not be completed";
    StatusMessage["USER_NOT_FOUND"] = "User not found";
    StatusMessage["EMAIL_NOT_FOUND"] = "No account associated with this email";
    StatusMessage["FORGOT_PASSWORD_REQUEST_FAILED"] = "Failed to process password reset request";
    StatusMessage["INVALID_INPUT"] = "Invalid input provided";
    StatusMessage["SEND_MESSAGE_FAILED"] = "Failed to send message";
    StatusMessage["GET_CHAT_HISTORY_FAILED"] = "Failed to get chat history";
    StatusMessage["MARK_MESSAGES_AS_READ_SUCCESS"] = "Messages marked as read";
    StatusMessage["MARK_MESSAGES_AS_READ_FAILED"] = "Failed to mark messages as read";
    StatusMessage["GET_UNREAD_MESSAGES_COUNT_FAILED"] = "Failed to get unread messages count";
    StatusMessage["ACCOUNT_BLOCKED"] = "Your account has been blocked by the admin.";
})(StatusMessage || (exports.StatusMessage = StatusMessage = {}));
