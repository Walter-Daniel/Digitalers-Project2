import express from 'express';
import { check } from 'express-validator';

import { validateFields } from '../middleware/validateFields.js';
import { login, renderLoginForm, renderRegisterForm } from '../controllers/auth.controller.js';
import { createUser } from '../controllers/user.constroller.js';
import { emailExist } from '../helpers/db-validators.js';

const router = express.Router();

router.get('/login', renderLoginForm)
router.post('/login', [

    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validateFields

], login)

router.get('/register', renderRegisterForm)
router.post('/register',
 [

    check('firstname').notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 4, max: 25 }).withMessage('Nombre(s) debe tener entre 4 y 25 carácteres'),
    check('lastname').notEmpty().withMessage('El apellido es obligatorio').isLength({ min: 4, max: 25 }).withMessage('Apellido(s) debe tener entre 4 y 25 carácteres'),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExist ),
    check('password').notEmpty().withMessage('Debe ingresar una contraseña').isLength({ min: 4, max: 9 }).withMessage('La contraseña debe tener entre 4 y 9 carácteres'),
    validateFields

],
 createUser);

export default router;