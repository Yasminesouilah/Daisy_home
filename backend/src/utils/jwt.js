import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAdminToken(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email }, env.jwtSecret, {
    expiresIn: "7d",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}