import { request } from 'express';
import { validationResult } from 'express-validator';


export const validateFields = (req=request, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('alert-danger', errors.array().map(e => e.msg));
        console.log(req.originalUrl)
        let urlOriginal = req.originalUrl;
        const url = urlOriginal.slice(1)
        let pageName = '';
        if(url.includes('register')){
            pageName = 'Registro'
        }
        if(url.includes('login')){
            pageName = 'Iniciar Sesión'
        }
        console.log({pageName})
        res.render(url, {
            pageName,
            messages: req.flash(),
            data: req.body
        })
        return;
    }
    next();
}