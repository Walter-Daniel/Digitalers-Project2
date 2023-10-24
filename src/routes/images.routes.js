import express from 'express';
import { check } from 'express-validator';

import { emailExist, isRole, findUserId, fromControl } from '../helpers/db-validators.js';
import { validateFields, isAdminRole, validateJWT } from '../middleware/index.js';
import { tokenInHeader } from '../middleware/jwtHeader.js';
import { uploadImagesCloudinary } from '../controllers/image.controller.js';

const router = express.Router();

router.get('/:id')
router.put('/:id', [
    // tokenInHeader,
    // validateJWT,
    // check('id', 'No es un id válido!').isMongoId(),
    // check('id').custom( findUserId ),
    // check('image', 'Debe ingresar una imagen').notEmpty(),
    // // check('role').custom( isRole ),
    // validateFields
],
 uploadImagesCloudinary);
router.delete('/:id')

export default router;