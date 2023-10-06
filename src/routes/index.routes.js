import express from 'express';
import { home } from '../controllers/home.controller.js';
import { renderAdminPage } from '../controllers/admin.controller.js';
import { tokenInHeader } from '../middleware/jwtHeader.js';
import { validateJWT } from '../middleware/validateJTW.js';
import { isAdminRole } from '../middleware/validateRoles.js';

const router = express.Router();

router.get('/', home)

router.get('/admin', [
    tokenInHeader, 
    validateJWT,
    isAdminRole,
], renderAdminPage)

export default router;
