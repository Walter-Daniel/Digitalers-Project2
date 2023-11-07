import express from 'express';
import { check } from 'express-validator';

import { isRole, findUserId } from '../helpers/db-validators.js';
import { validateFields, isAdminRole, validateJWT, hasARole } from '../middleware/index.js';
import { tokenInHeader } from '../middleware/jwtHeader.js';
import { createAppointment, deleteAppointment, getAppointment, renderCreate, showConsultation, updateAppointment } from '../controllers/appointment.controller.js';

const router = express.Router();

router.get('/create', [
    tokenInHeader,
    validateJWT,
    isAdminRole,
    validateFields
], renderCreate);
router.post('/create', [

    tokenInHeader,
    validateJWT,
    hasARole('ADMIN_ROLE', 'SECRETARY_ROLE', 'DOCTOR_ROLE'),
    // check('client', 'El id del Cliente es obligatorio').notEmpty().isString(),
    check('doctor', 'El id del Doctor es obligatorio').notEmpty().isString(),
    check('price', 'Debe ingresar el precio de la consulta').notEmpty().isNumeric(),
    check('date', 'Debes ingresar una fecha').notEmpty(),
    check('appointmentTime', 'Debes ingresar una hora').notEmpty(),
    validateFields

], createAppointment);

// UPDATE USER
router.put('/:id', [

    tokenInHeader,
    validateJWT,
    hasARole('ADMIN_ROLE', 'SECRETARY_ROLE', 'USER_ROLE'),
    validateFields

], updateAppointment);

//Traer citas de la base de datos
router.get('/public/:id', showConsultation)
router.get('/', [

    tokenInHeader,
    validateJWT,
    hasARole('ADMIN_ROLE', 'SECRETARY_ROLE'),
    validateFields
    
], getAppointment);

router.delete('/:id',[

    tokenInHeader,
    validateJWT,
    isAdminRole,
    hasARole('ADMIN_ROLE', 'SECRETARY_ROLE'),
    check('id', 'No es un id válido!').isMongoId(),
    check('id').custom( findUserId ),
    validateFields

], deleteAppointment);

export default router;