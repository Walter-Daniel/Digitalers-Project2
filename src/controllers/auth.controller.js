import bcrypt from 'bcryptjs';
import {config} from 'dotenv';
import User from '../model/user.schema.js';
import { createJWT } from '../middleware/jwtValidation.js';
import { response } from 'express';
config();


//SI EL ROL ES ADMIN => REDIRECCIONAR A LA PAG DE ADMINISTARCIÓN
//SI EL ROL ES DOCTOR => REDIRECCIONAR A LA PAGINA DE CITAS Y CONSULTAS
//SI EL ROL ES USER => REDIRECCIONAR AL INICIO + BOX DE BIENVENIDA
export const renderLoginForm = (req, res=response)=> {

    res.render('auth/login', {
        pageName: 'Iniciar Sesión',
        navbar: false,
        renderHero: false
    })
}
export const login = async(req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if(!user){
            req.flash('alert-danger', 'Credenciales Incorrectas');
            return res.render('auth/login',{
                pageName: 'Iniciar Sesión',
                messages: req.flash(),
                data: req.body
            })
        }
        if(!user.active){
            req.flash('alert-danger', 'Credenciales Incorrectas');
            return res.render('auth/login',{
                pageName: 'Iniciar Sesión',
                messages: req.flash(),
                data: req.body
            })
        }
        const validPassword = bcrypt.compareSync( password, user.password )
        if(!validPassword){
            req.flash('alert-danger', 'Credenciales Incorrectas');
            return res.render('auth/login',{
                pageName: 'Iniciar Sesión',
                messages: req.flash(),
                data: req.body
            })
        }
        const token = await createJWT(user._id)
        res.cookie('token', token, { httpOnly: true });

        if(user.role === 'USER_ROLE'){
            res.redirect(`/user/${user.id}`);
        }else if(user.role === 'ADMIN_ROLE'){
            res.redirect(`/admin`);
        }
        
    } catch (error) {
        console.log('estou en error')
    }
    // try {
       
    //     const user = await User.findOne({ email })
    //     //Verificar si el correo existe
    //     if(!user){
    //         res.status(400).json({
    //             ok: false,
    //             msg: 'Credenciales incorrectas'
    //         })
    //     }
    //     //Verificar si se encuentra activo
    //     if(!user.active){
    //         res.status(400).json({
    //             ok: false,
    //             msg: 'Credenciales incorrectas'
    //         })
    //     }
    //     //Verificar contraseña
    //     const validPassword = bcrypt.compareSync( password, user.password )
    //     if(!validPassword){
    //         res.status(400).json({
    //             ok: false,
    //             msg: 'Credenciales incorrectas'
    //         })
    //     }
    //     //se genera el JWT
    //     const token = await createJWT(user._id)
        
    //     //Guardar JWT en localstorage
    //     localStorage.setItem("miToken", token);

    //     // res.redirect('user/profile')
    //     res.status(201).json({
    //         ok: true,
    //         msg: 'Inicio de sesión exitoso',
    //         user,
    //         token
    //     });
        
    // } catch (error) {
    //     res.status(500).json({
    //         ok: false,
    //         msg: 'Error al iniciar sesión',
    //         error
    //     });
    // };   
    // return;
};

export const renderRegisterForm = (req, res=response)=> {

    res.render('auth/register', {
        pageName: 'Registro',
        navbar: false,
        renderHero: false
    })
}