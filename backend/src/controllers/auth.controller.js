import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { loginSchema } from "../validators/auth.validator.js";
import { signAdminToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || "Données invalides.");
  }

  const { email, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } });
  if (!admin) throw new ApiError(401, "Identifiants invalides.");

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) throw new ApiError(401, "Identifiants invalides.");

  const token = signAdminToken(admin);
  res.json({ token, admin: { id: admin.id, email: admin.email } });
}

export function getMe(req, res) {
  res.json({ admin: req.admin });
}