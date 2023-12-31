import express from 'express';
import { check } from 'express-validator';

import { createDoctor, updateDoctor, getDoctors, deleteDoctor, renderFormCreate, renderFormUpdate, renderProfile, renderPrivateProfile } from '../controllers/doctor.controller.js';
import { emailExist, isRole, findUserId, fromControl, setCategory, findID } from '../helpers/db-validators.js';
import { validateFields, isAdminRole, validateJWT, hasARole } from '../middleware/index.js';
import { tokenInHeader } from '../middleware/jwtHeader.js';

const router = express.Router();

router.get('/create', [
    tokenInHeader,
    validateJWT,
    isAdminRole,
], renderFormCreate);

router.post('/create', [

    tokenInHeader,
    validateJWT,
    isAdminRole,
    check('firstname', 'El nombre es obligatorio').notEmpty(),
    check('lastname', 'El apellido es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExist ),
    check('password', 'El password debe tener entre 4 y 9 carácteres').notEmpty().isLength({ min: 4, max: 9 }),
    check('role').custom( isRole ),
    check('phoneNumber', 'Ingrese un número de teléfono').notEmpty().isNumeric(),
    check('cellphone', 'Ingrese un número de celular').notEmpty().isNumeric(),
    check('category').custom( setCategory ),
    validateFields
    
], createDoctor);
//Renderizar el perfil del doctor
router.get('/profile', renderPrivateProfile);

router.get('/public/:id', [

    tokenInHeader,
    validateJWT,
    validateFields

], renderProfile);

//Update Doctor
router.get('/:id', [

    tokenInHeader,
    validateJWT,
    hasARole('ADMIN_ROLE', 'DOCTOR_ROLE'),
    validateFields

], renderFormUpdate);
router.put('/:id', [

    tokenInHeader,
    validateJWT,
    hasARole('ADMIN_ROLE', 'DOCTOR_ROLE'),
    // check('id', 'No es un id válido!').isMongoId(),
    // check('id').custom( findUserId ),
    // findID('Doctor'),
    validateFields

], updateDoctor);

//Profile Render
router.get('/',[   
    tokenInHeader,
    validateJWT,
    hasARole('ADMIN_ROLE', 'DOCTOR_ROLE'),
    // check('id', 'No es un id válido!').isMongoId(),
    // check('id').custom( findUserId ),
    // findID('Doctor'),
    validateFields

], getDoctors);

router.delete('/:id',[

    tokenInHeader,
    validateJWT,
    isAdminRole,
    // check('id', 'No es un id válido!').isMongoId(),
    // check('id').custom( findUserId ),
    validateFields

], deleteDoctor);


export default router;