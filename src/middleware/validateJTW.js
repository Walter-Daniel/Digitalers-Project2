import jwt from 'jsonwebtoken';
import User from '../model/user.schema.js';

export const validateJWT = async(req, res, next) => {

    const token = req.header('x-token');

    if(!token){

        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });

    }

    try {

        const { id } = jwt.verify( token, process.env.SECRETSEED );
        const user = await User.findById( id );

        if(!user){
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no existe en base de datos',
                error
            })
        }

        //Verificar si active:true
        if(!user.active){
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido',
                error
            })
        }

        req.user = user;
        next();

    } catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'Token no válido',
            error
        })
    }
}