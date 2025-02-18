import express from 'express';
import { authenticate } from '../middleware/VerifyToken.js';
import { addRecruiter } from '../controllers/Recruiter/addRecruiter.js';
import { allRecruiter } from '../controllers/Recruiter/allRecruiter.js';
import { getRecruiter } from '../controllers/Recruiter/getRecruiter.js';

const router = express.Router();

router.post('/post-recruiter', authenticate, addRecruiter); 
router.get('/get-recruiter/:id', authenticate, getRecruiter);
router.get('/all-recruiter', authenticate, allRecruiter);

export default router;