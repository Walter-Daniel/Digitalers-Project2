import jwt from "jsonwebtoken";

export const createJWT = ( id = '' ) => {

    return new Promise( (resolve, reject) => {
        const payload = { id }
        jwt.sign( payload, process.env.SECRETSEED, {
            expiresIn: '8h'
        }, ( err, token ) => {
            if( err ){
                reject('No se pudo generar el token')
            }else{
                resolve(token)
            }
        })
    })
};
