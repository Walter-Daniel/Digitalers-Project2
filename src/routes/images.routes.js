import express from 'express';
import { check } from 'express-validator';

import { emailExist, isRole, findUserId, fromControl, } from '../helpers/db-validators.js';
import { validateFields, isAdminRole, validateJWT, hasARole } from '../middleware/index.js';
import { tokenInHeader } from '../middleware/jwtHeader.js';
import { uploadImagesCloudinary } from '../controllers/image.controller.js';

const router = express.Router();

router.get('/:id')
router.post('/:id', [
    tokenInHeader,
    validateJWT,
    hasARole('USER_ROLE', 'DOCTOR_ROLE', 'ADMIN_ROLE'),
    // check('id', 'No es un id válido!').isMongoId(),
    // check('id').custom( findUserId ),
    // check('image').custom(imgExtention),
    validateFields
],
 uploadImagesCloudinary);

export default router;