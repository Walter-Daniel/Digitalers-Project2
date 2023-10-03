import express from 'express';
import { check } from 'express-validator';

import { validateFields } from '../middleware/validateFields.js';
import { login, renderRegisterForm } from '../controllers/auth.controller.js';
import { createUser } from '../controllers/user.constroller.js';
import { emailExist } from '../helpers/db-validators.js';

const router = express.Router();


router.post('/login', [

    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validateFields

], login)

router.get('/register', renderRegisterForm)
router.post('/register', [

    check('firstname', 'El nombre es obligatorio').notEmpty(),
    check('lastname', 'El apellido es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExist ),
    check('password', 'El password debe tener entre 4 y 9 carácteres').notEmpty().isLength({ min: 4, max: 9 }),
    validateFields

], createUser);

export default router;