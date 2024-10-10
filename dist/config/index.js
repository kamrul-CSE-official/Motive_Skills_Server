"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    NODE_ENV: process.env.NODE_ENV,
    port: Number(process.env.PORT) || 5000,
    db_url: process.env.DB_URL,
    auth: {
        salt_round: Number(process.env.BCRYPT_SALT_ROUNDS) || 5,
        accessTokenSecret: process.env.JWT_SECRET || "",
        accessTokenExpiresIn: process.env.TOKEN_EXPIRES || 172800000,
    },
    fileUpload: {
        api: process.env.CLOUDINARY_API ||
            "https://your-cloudinary-upload-url/api/v1/fileuploader",
        key: process.env.CLOUDINARY_API_KEY || "",
    },
};
