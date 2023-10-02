export const isAdminRole = (req,res, next) => {

    if(!req.user){
        return res.status(500).json({
            ok: false,
            msg: 'No se puede verificar el rol sin velidar el token primero.'
        });
    }

    const { role } = req.user;

    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            msg: 'No posee los permisos necesarios para realizar esta acción.'
        })
    }

    next();
}

export const hasARole = (...roles) => {

    return( req, res, next ) => {

        if(!req.user){
            return res.status(500).json({
                ok: false,
                msg: 'No se puede verificar el rol sin velidar el token primero.'
            });
        }

        if( !roles.includes(req.user.role) ){
            return res.status(401).json({
                ok: false,
                msg: 'No posee los permisos necesarios para realizar esta acción.'
            })
        }
        console.log(roles, req.user.role);

        next();
    }

}