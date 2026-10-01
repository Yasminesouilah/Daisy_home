import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentification requise."));
  }

  try {
    const payload = verifyToken(header.slice("Bearer ".length));
    if (typeof payload === "string" || !payload.sub || !payload.email) {
      throw new Error("Invalid token payload");
    }

    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(new ApiError(401, "Session invalide ou expirée."));
  }
}