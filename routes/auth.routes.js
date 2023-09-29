

import express from 'express';
import { register } from '../controllers/user.controller.js';
const router = express.Router();

//Rutas
router.get('/home', (req, res)=>{
    res.send(`<h1>Bienvenido/a a la App Administrador/a</h1>`);
});

router.post('/register', register);

export default router;