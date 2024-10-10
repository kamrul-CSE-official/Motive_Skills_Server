"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const createAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.default.auth.accessTokenSecret, {
        expiresIn: Number(config_1.default.auth.accessTokenExpiresIn) || 172800000,
        algorithm: "HS384",
    });
};
exports.createAccessToken = createAccessToken;
