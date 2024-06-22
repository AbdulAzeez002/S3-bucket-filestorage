// custom.d.ts
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    file?: {
      originalname: string;
      buffer: Buffer;
      mimetype: string;
    };
  }
}
