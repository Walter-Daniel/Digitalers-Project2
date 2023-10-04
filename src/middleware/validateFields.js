import { request } from 'express';
import { validationResult } from 'express-validator';


export const validateFields = (req=request, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('alert-danger', errors.array().map(e => e.msg));

        res.render('auth/register', {
            pageName: 'Registro',
            messages: req.flash()
        })
        return;
    }
    next();
}