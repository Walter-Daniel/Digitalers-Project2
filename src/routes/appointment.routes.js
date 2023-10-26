import express from 'express';
import { check } from 'express-validator';

import { emailExist, isRole, findUserId, fromControl } from '../helpers/db-validators.js';
import { validateFields, isAdminRole, validateJWT } from '../middleware/index.js';
import { tokenInHeader } from '../middleware/jwtHeader.js';
import { createAppointment } from '../controllers/appointment.controller.js';

const router = express.Router();

router.post('/create', [

    // tokenInHeader,
    // validateJWT,
    // isAdminRole,
    // check('clientID', 'El nombre es obligatorio').notEmpty(),
    // check('lastname', 'El apellido es obligatorio').notEmpty(),
    // check('email', 'El correo no es válido').isEmail(),
    // check('email').custom( emailExist ),
    // check('password').notEmpty().withMessage('Debe ingresar su contraseña').isLength({ min: 4, max: 9 }).withMessage('La contraseña debe tener entre 4 y 9 carácteres'),
    // check('role').custom( isRole ),
    // validateFields

], createAppointment);


// // UPDATE USER
// router.get('/:id', [
//     tokenInHeader,
//     validateJWT,
//     check('id', 'No es un id válido!').isMongoId(),
//     check('id').custom( findUserId ),
//     validateFields
// ],updateUserFormRender)
// router.put('/:id', [
//     tokenInHeader,
//     validateJWT,
//     // isAdminRole,
//     check('id', 'No es un id válido!').isMongoId(),
//     check('id').custom( findUserId ),
//     check('role').custom( isRole ),
//     validateFields
// ], updateUser);

// //Traer usuarios de la base de datos
// router.get('/profile',[
//     tokenInHeader,
//     validateJWT
// ], renderUserProfile)
// router.get('/', [
//     tokenInHeader,
//     validateJWT,
//     isAdminRole,
//     check('from').custom( fromControl ),
//     validateFields
    
// ], getUsers);

// router.delete('/:id',[
//     tokenInHeader,
//     validateJWT,
//     isAdminRole,
//     // hasARole('ADMIN_ROLE', 'DOCTOR_ROLE'),
//     check('id', 'No es un id válido!').isMongoId(),
//     check('id').custom( findUserId ),
//     validateFields

// ], deleteUser);

//panel de administracion



export default router;