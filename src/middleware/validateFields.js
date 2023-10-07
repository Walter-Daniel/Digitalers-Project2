import { request } from 'express';
import { validationResult } from 'express-validator';


export const validateFields = (req=request, res, next) => {
    const errors = validationResult(req);
    // console.log(req.body)
    if(!errors.isEmpty()){
        req.flash('alert-danger', errors.array().map(e => e.msg));
        let urlOriginal = req.originalUrl;
        console.log(req.body)
        const url = urlOriginal.slice(1)
        let pageName = '';
        if(url.includes('register')){
            pageName = 'Registro'
        }
        if(url.includes('login')){
            pageName = 'Iniciar Sesión'
        }
        if(url.includes('create' && 'doctor')){
            pageName = 'dkjflksjkld'
        }
        res.render(url, {
            pageName,
            messages: req.flash(),
            data: req.body
        })
        return;
    }
    next();
}