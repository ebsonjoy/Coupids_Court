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
exports.s3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class S3Service {
    constructor() {
        this.s3 = new client_s3_1.S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: process.env.AWS_REGION,
        });
        this.bucket = process.env.AWS_BUCKET_NAME;
    }
    generateSignedUrls(fileTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(fileTypes.map((fileType) => __awaiter(this, void 0, void 0, function* () {
                const fileKey = `profilePhotos/user_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileType.split('/')[1]}`;
                const putObjectCommand = new client_s3_1.PutObjectCommand({
                    Bucket: this.bucket,
                    Key: fileKey,
                    ContentType: fileType,
                });
                const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(this.s3, putObjectCommand, {
                    expiresIn: 3600,
                    signableHeaders: new Set(['content-type'])
                });
                return {
                    signedUrl,
                    fileKey,
                    publicUrl: `https://s3.${process.env.AWS_REGION}.amazonaws.com/${this.bucket}/${fileKey}`
                };
            })));
        });
    }
    deleteImageFromS3Bucket(publicUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileKey = publicUrl.split(`${this.bucket}/`)[1];
                if (!fileKey) {
                    console.error("Invalid file URL:", publicUrl);
                    return false;
                }
                const deleteObjectCommand = new client_s3_1.DeleteObjectCommand({
                    Bucket: this.bucket,
                    Key: fileKey,
                });
                yield this.s3.send(deleteObjectCommand);
                console.log(`Deleted image: ${fileKey}`);
                return true;
            }
            catch (error) {
                console.error("Error deleting file from S3:", error);
                return false;
            }
        });
    }
}
exports.s3Service = new S3Service();
