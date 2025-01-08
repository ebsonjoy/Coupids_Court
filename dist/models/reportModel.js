"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReportSchema = new mongoose_1.Schema({
    reporterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    reportedId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    additionalDetails: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Resolved'],
        default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
const Report = (0, mongoose_1.model)('Report', ReportSchema);
exports.default = Report;
