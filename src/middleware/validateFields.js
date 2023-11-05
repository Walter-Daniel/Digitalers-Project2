import { request } from 'express';
import { validationResult } from 'express-validator';


export const validateFields = (req=request, res, next) => {
    const errors = validationResult(req);
    const {id} = req.params
    // console.log(req.body)
    if(!errors.isEmpty()){
        req.flash('alert-danger', errors.array().map(e => e.msg));
        let urlOriginal = req.originalUrl;
        console.log(urlOriginal, 'estamos aquí')
        const url = urlOriginal.slice(1)
        const urlPrev = req.session.prevUrl
        let pageName = '';
        if(url.includes('register')){
            pageName = 'Registro'
        }
        if(url.includes('login')){
            pageName = 'Iniciar Sesión'
        }
        if(url.includes('images') ){
           return res.redirect(urlPrev)
        }
        if(url.includes('user') ){
           return res.redirect(urlPrev)
        }
        res.render(url, {
            pageName,
            data: req.body,
            messages: req.flash(),
            user: req.user,
            navbar: true
        })
        return;
    }
    next();
}