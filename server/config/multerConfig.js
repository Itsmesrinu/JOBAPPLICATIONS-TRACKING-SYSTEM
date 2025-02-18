import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = file.fieldname === 'resume' ? 'uploads/resumes' : 'uploads/other';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
}); 