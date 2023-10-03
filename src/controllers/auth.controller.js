import bcrypt from 'bcryptjs';
import {config} from 'dotenv';
import User from '../model/user.schema.js';
import { createJWT } from '../middleware/jwtValidation.js';
import { response } from 'express';
config();


//SI EL ROL ES ADMIN => REDIRECCIONAR A LA PAG DE ADMINISTARCIÓN
//SI EL ROL ES DOCTOR => REDIRECCIONAR A LA PAGINA DE CITAS Y CONSULTAS
//SI EL ROL ES USER => REDIRECCIONAR AL INICIO + BOX DE BIENVENIDA

export const login = async(req, res) => {

    const { email, password } = req.body;

    try {
       
        const user = await User.findOne({ email })
        //Verificar si el correo existe
        if(!user){
            res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            })
        }
        //Verificar si se encuentra activo
        if(!user.active){
            res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            })
        }
        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password, user.password )
        if(!validPassword){
            res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            })
        }
        //se genera el JWT
        const token = await createJWT(user._id)
        res.status(201).json({
            ok: true,
            msg: 'Inicio de sesión exitoso',
            user,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al iniciar sesión'
        });
    };   
};

export const renderRegisterForm = (req, res=response)=> {

    res.render('auth/register', {
        pageName: 'Registro',
        navbar: false,
        renderHero: false
    })
}