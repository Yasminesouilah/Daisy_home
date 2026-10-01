import cloudinary from "../config/cloudinary.js";

export function uploadImageBuffer(buffer, folder = "daisyhome/products") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result?.secure_url) {
          reject(new Error("Cloudinary did not return a secure image URL."));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}