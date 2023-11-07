import { request, response } from 'express';
import { validationResult } from 'express-validator';


export const validateFields = (req=request, res= response, next) => {
    const errors = validationResult(req);
    const user = req.user;
    const {id} = req.params
    // console.log(req.body)
    if(!errors.isEmpty()){
        req.flash('alert-danger', errors.array().map(e => e.msg));
        let urlOriginal = req.originalUrl;
        const url = urlOriginal.slice(1);
        const urlPrev = req.session.prevUrl
        let pageName = '';
        if(url.includes('register')){
           return res.render(url, {
                pageName: 'Registro',
                data: req.body,
                messages: req.flash(),
                user: req.user,
            })
        }
        if(url.includes('login')){
            return res.redirect('/auth/login')
        }
        if(url.includes('images') ){
           return res.redirect(urlPrev)
        }
        // if(url.includes('user') ){
        //     console.log('hermos caído aquí')
        //    return res.redirect(urlPrev)
        // }
        
        if(url.includes('appointment/create') ){
            if(user.role === 'DOCTOR_ROLE'){
                return res.redirect('/doctor/profile')
            }else{
                return res.redirect('/appointment')
            }
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