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
exports.uploadImage = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const stream_1 = require("stream");
const config_1 = __importDefault(require("../config"));
// Ensure that the file type from multer is properly handled
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Create a new FormData instance
        const formData = new form_data_1.default();
        // Append the buffer to FormData
        formData.append('file', stream_1.Readable.from(file.buffer), file.originalname);
        // Adjust the URL and headers based on your setup
        const response = yield axios_1.default.post("https://cloudinary-upload-server-psi.vercel.app/api/v1/fileuploader", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "x-api-key": config_1.default.fileUpload.key,
            },
        });
        return yield ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.fileUrl);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
});
exports.uploadImage = uploadImage;
