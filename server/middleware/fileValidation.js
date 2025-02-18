import multer from 'multer';
import { fileStorage } from '../config/multerConfig.js';

export const uploadMiddleware = multer({
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}); 