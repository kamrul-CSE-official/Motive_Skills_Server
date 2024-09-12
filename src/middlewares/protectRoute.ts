import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import User from "../modules/user/user.model"; 
import { IUser } from "../modules/user/user.interface";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
    interface Request {
      user?: IUser;
    }
  }
  
  // Middleware to verify role-based access
  export const protectRoute = (requiredRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "Authorization header missing or invalid" });
        }
  
        const token = authHeader.split(" ")[1];
  
        // Use jwt.verify to decode the token and specify JwtPayload as the return type
        const decoded = jwt.verify(token, config.auth.accessTokenSecret) as JwtPayload;
  
        // Find user by the decoded ID and select the required fields
        const user = await User.findById(decoded._id).select("+role +accessTokens") as IUser;
  
        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }
  
        // Ensure that accessTokens is defined and includes the token
        if (!user.accessTokens || !user.accessTokens.includes(token)) {
          return res.status(401).json({ message: "Invalid access token" });
        }
  
        // Check if the user role is among the required roles
        if (!requiredRoles.includes(user.role)) {
          return res.status(403).json({ message: "You do not have permission to access this resource" });
        }
  
        // Attach the user to the request object for use in the next middleware or route handler
        req.user = user;
        next();
      } catch (error) {
        console.log("Error in protectRoute middleware:", (error as Error).message);
        res.status(500).json({ message: "Internal server error" });
      }
    };
  };