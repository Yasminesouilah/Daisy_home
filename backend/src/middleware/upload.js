import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, callback) {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }
    callback(new ApiError(400, "Seuls les fichiers image sont acceptés."));
  },
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});