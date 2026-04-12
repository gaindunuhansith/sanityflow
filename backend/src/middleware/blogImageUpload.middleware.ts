import multer from 'multer';
import type { RequestHandler } from 'express';
import env from '../config/env.js';
import { AppError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../constants/index.js';

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.BLOG_IMAGE_MAX_MB * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid image format. Allowed types: JPEG, PNG, WebP.'));
      return;
    }

    callback(null, true);
  },
});

const singleUpload = upload.single('coverImage');

export const blogCoverImageUpload: RequestHandler = (req, res, next) => {
  singleUpload(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        next(new AppError(HTTP_STATUS.BAD_REQUEST, `Image size exceeds ${env.BLOG_IMAGE_MAX_MB}MB limit.`));
        return;
      }

      next(new AppError(HTTP_STATUS.BAD_REQUEST, error.message));
      return;
    }

    next(error);
  });
};
