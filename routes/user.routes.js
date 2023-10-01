import express from 'express';
import { check } from 'express-validator';
import { deleteUser, getUsers, login, createUser, updateUser } from '../controllers/user.constroller.js';
import { validateFields } from '../middleware/validateFields.js';
import { emailExist, isRole, findUserId, fromControl } from '../helpers/db-validators.js';
const router = express.Router();

router.post('/register', [

    check('firstname', 'El nombre es obligatorio').notEmpty(),
    check('lastname', 'El apellido es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExist ),
    check('password', 'El password debe tener entre 4 y 9 carácteres').notEmpty().isLength({ min: 4, max: 9 }),
    check('role').custom( isRole ),
    validateFields

], createUser);

router.put('/:id', [

    check('id', 'No es un id válido!').isMongoId(),
    check('id').custom( findUserId ),
    check('role').custom( isRole ),
    validateFields

], updateUser);
router.get('/', [

    check('from').custom( fromControl ),
    validateFields
    
], getUsers);
router.delete('/:id',[

    check('id', 'No es un id válido!').isMongoId(),
    check('id').custom( findUserId ),
    validateFields

], deleteUser);

router.post('/login', login);


export default router;