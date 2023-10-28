import bcrypt from 'bcryptjs';
import {config} from 'dotenv';
import User from '../model/user.schema.js';
import Doctor from '../model/doctor.schema.js';
import { createJWT } from '../middleware/jwtValidation.js';
import { response, request } from 'express';
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
export const login = async(req=request, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).lean();
        const doctor = await Doctor.findOne({ email }).lean();

        if(user){
            const token = await createJWT(user._id)
            const validPassword = bcrypt.compareSync( password, user.password )
            if(!validPassword){
                req.flash('alert-danger', 'Credenciales Incorrectas');
                return res.render('auth/login',{
                    pageName: 'Iniciar Sesión',
                    messages: req.flash(),
                    data: req.body
                })
            }
            res.cookie('token', token, { httpOnly: true });
            res.redirect(`/`);
        }else if(doctor){
            const token = await createJWT(doctor._id)
            const validPassword = bcrypt.compareSync( password, doctor.password )
            if(!validPassword){
                req.flash('alert-danger', 'Credenciales Incorrectas');
                return res.render('auth/login',{
                    pageName: 'Iniciar Sesión',
                    messages: req.flash(),
                    data: req.body
                })
            }
            
            res.cookie('token', token, { httpOnly: true });
            res.redirect(`/`);
        }else{
            req.flash('alert-danger', 'Credenciales Incorrectas');
            return res.render('auth/login',{
                pageName: 'Iniciar Sesión',
                messages: req.flash(),
                data: req.body
            })
        }


        // if(!user){
        //     req.flash('alert-danger', 'Credenciales Incorrectas');
        //     return res.render('auth/login',{
        //         pageName: 'Iniciar Sesión',
        //         messages: req.flash(),
        //         data: req.body
        //     })
        // }
        // if(!user.active){
        //     req.flash('alert-danger', 'Credenciales Incorrectas');
        //     return res.render('auth/login',{
        //         pageName: 'Iniciar Sesión',
        //         messages: req.flash(),
        //         data: req.body
        //     })
        // }
        // const validPassword = bcrypt.compareSync( password, user.password )
        // if(!validPassword){
        //     req.flash('alert-danger', 'Credenciales Incorrectas');
        //     return res.render('auth/login',{
        //         pageName: 'Iniciar Sesión',
        //         messages: req.flash(),
        //         data: req.body
        //     })
        // }
        // const token = await createJWT(user._id)
        // res.cookie('token', token, { httpOnly: true });

        // res.redirect(`/`);
        
    } catch (error) {
        console.log('estou en error')
    }
};

export const logout = async(req=request, res=response) => {
    res.cookie('token', '', { expires: new Date(0) });
    req.flash('alert-success', 'Has salido de la aplicación')
    res.redirect('/auth/login');
}

export const renderRegisterForm = (req, res=response)=> {

    res.render('auth/register', {
        pageName: 'Registro',
        navbar: false,
        renderHero: false
    })
}