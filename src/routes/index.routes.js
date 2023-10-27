import express from 'express';
import { home } from '../controllers/home.controller.js';
import { renderAdminPage } from '../controllers/admin.controller.js';
import { tokenInHeader } from '../middleware/jwtHeader.js';
import { validateJWT } from '../middleware/validateJTW.js';
import { isAdminRole } from '../middleware/validateRoles.js';
import { check } from 'express-validator';
import { isRole } from '../helpers/db-validators.js';
import { validateFields } from '../middleware/validateFields.js';

const router = express.Router();

router.get('/', [
    tokenInHeader,
    validateJWT,
    check('role').custom( isRole ),
    validateFields
],
 home)

router.get('/admin', [
    tokenInHeader, 
    validateJWT,
    isAdminRole,
], renderAdminPage)

export default router;
