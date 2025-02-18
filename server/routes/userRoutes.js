import express from 'express';
import { authenticate } from '../middleware/VerifyToken.js';
import User from '../models/User.js';
import { userValidation } from './validation.js';

const router = express.Router();

import { getUsers } from '../controllers/User/getUsers.js';
import { getUser } from '../controllers/User/getUser.js';
import { addUser } from '../controllers/User/addUser.js';
import { deleteUser } from '../controllers/User/deleteUser.js';
import { updateUser } from '../controllers/User/updateUser.js';
import { updateUserByCandidate } from '../controllers/User/updateUserByCandidate.js';
import { getRecruiters, approveRecruiter } from '../controllers/User/getRecruiters.js';

router.get('/all-users', getUsers); 
router.post('/add-user', userValidation, addUser); 
router.get('/user/:id', getUser); 
router.delete('/delete-user/:id', deleteUser); 
router.put('/update-user/:id', updateUser);
router.put('/update-user-by-candidate/', updateUserByCandidate);

// Get all recruiters
router.get('/recruiters', authenticate, getRecruiters);
router.put('/recruiters/:id/approve', authenticate, approveRecruiter);

export default router;