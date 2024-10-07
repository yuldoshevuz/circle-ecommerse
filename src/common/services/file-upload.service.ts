import { Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class FileUploadService {
  uploadFileOptions(): MulterOptions {
    return {
      storage: multer.diskStorage({
        destination: path.join(process.cwd(), 'public', 'images'),
        filename(
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          callback(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
          );
        },
      }),
      fileFilter(
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) {
        const fileTypes = /jpg|jpeg|png/;
        const extname = fileTypes.test(
          path.extname(file.originalname).toLowerCase(),
        );
        const mimetype = fileTypes.test(file.mimetype);

        const imagesPath = path.join(process.cwd(), 'public', 'images');

        if (!fs.existsSync(imagesPath))
          fs.mkdirSync(imagesPath, { recursive: true });

        if (extname && mimetype) {
          return callback(null, true);
        }

        callback(
          new ValidationException([], 'You have not uploaded an image format file'),
          false,
        );
      },
      limits: { fieldSize: 1000000 }, // 1MB limit
    };
  }
}