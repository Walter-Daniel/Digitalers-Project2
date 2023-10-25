import { request } from 'express';
import { validationResult } from 'express-validator';


export const validateFields = (req=request, res, next) => {
    const errors = validationResult(req);
    const {id} = req.params
    // console.log(req.body)
    if(!errors.isEmpty()){
        req.flash('alert-danger', errors.array().map(e => e.msg));
        let urlOriginal = req.originalUrl;
        
        const url = urlOriginal.slice(1)
        console.log(url)
        let pageName = '';
        if(url.includes('register')){
            pageName = 'Registro'
        }
        if(url.includes('login')){
            pageName = 'Iniciar Sesión'
        }
        if(url.includes('images') ){
            res.redirect(`/user/profile/update/${id}`)
         }
        res.render(url, {
            pageName,
            data: req.body
        })
        return;
    }
    next();
}