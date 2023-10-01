import express from 'express';
import { check } from 'express-validator';
import { login, register } from '../controllers/user.constroller.js';
import { validateFields } from '../middleware/validateFields.js';
import { emailExist, isRole } from '../helpers/db-validators.js';
const router = express.Router();

router.post('/register', [
    check('firstname', 'El nombre es obligatorio').notEmpty(),
    check('lastname', 'El apellido es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExist ),
    check('password', 'El password debe tener entre 4 y 9 carácteres').notEmpty().isLength({ min: 4, max: 9 }),
    check('role').custom( isRole ),
    validateFields
], register);
router.post('/login', login);


export default router;