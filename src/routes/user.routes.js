import express from 'express';
import { check } from 'express-validator';

import { deleteUser, getUsers, createUser, updateUser } from '../controllers/user.constroller.js';
import { emailExist, isRole, findUserId, fromControl } from '../helpers/db-validators.js';
import { validateFields, isAdminRole, validateJWT } from '../middleware/index.js';

const router = express.Router();

router.post('/create', [

    validateJWT,
    isAdminRole,
    check('firstname', 'El nombre es obligatorio').notEmpty(),
    check('lastname', 'El apellido es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExist ),
    check('password', 'El password debe tener entre 4 y 9 carácteres').notEmpty().isLength({ min: 4, max: 9 }),
    check('role').custom( isRole ),
    validateFields

], createUser);

router.put('/:id', [

    validateJWT,
    isAdminRole,
    check('id', 'No es un id válido!').isMongoId(),
    check('id').custom( findUserId ),
    check('role').custom( isRole ),
    validateFields

], updateUser);
router.get('/', [

    validateJWT,
    isAdminRole,
    check('from').custom( fromControl ),
    validateFields
    
], getUsers);
router.delete('/:id',[

    validateJWT,
    isAdminRole,
    // hasARole('ADMIN_ROLE', 'DOCTOR_ROLE'),
    check('id', 'No es un id válido!').isMongoId(),
    check('id').custom( findUserId ),
    validateFields

], deleteUser);


export default router;