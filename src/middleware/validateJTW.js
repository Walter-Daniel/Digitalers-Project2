import jwt from 'jsonwebtoken';
import User from '../model/user.schema.js';

export const validateJWT = async(req, res, next) => {

    const token = req.header('x-token');


    if(!token){
        req.flash('alert-danger', 'Token expirado');
        return res.redirect('/auth/login')
    }

    try {

        const { id } = jwt.verify( token, process.env.SECRETSEED );
        const user = await User.findById( id ).lean();

        if(!user){
            req.flash('alert-danger', 'Usuario no existe en base de datos');
            return res.redirect('/auth/login');
        }

        //Verificar si active:true
        if(!user.active){
            req.flash('alert-danger', 'Token no válido');
            return res.redirect('/auth/login');
        }
        
        req.user = user;
        next();

    } catch (error) {
        req.flash('alter-danger', `${error.message}`)
        return res.redirect('/auth/login')
    }
}