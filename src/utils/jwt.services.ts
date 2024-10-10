import jwt from "jsonwebtoken";
import config from "../config";
import mongoose from "mongoose";

interface JwtPayload {
  [key: string]: string | mongoose.Types.ObjectId; 
}

export const createAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.auth.accessTokenSecret as string, {
    expiresIn: Number(config.auth.accessTokenExpiresIn) || 172800000,
    algorithm: "HS384",
  });
};
