import { response } from "express";
import Doctor from '../model/doctor.schema.js';
import User from '../model/user.schema.js';
import jwt from 'jsonwebtoken';
import handlebars from "express-handlebars";

export const home = async(req, res=response) => {

    const user = req.user;
    try {

        const query = { role: 'DOCTOR_ROLE' }
        const [doctors, total] = await Promise.all([
            Doctor.find(query).lean(),
               
            Doctor.count(query)
        ]);

        if(doctors.length === 0){
            return res.status(404).send({
                ok: true,
                message: 'No se encontró ningun doctor'
            })
        }
        
        res.render('home', {
            pageName: 'Medical Digitalers',
            navbar: true,
            renderHero: true,
            doctors,
            user
        })
    } catch (error) {
        console.log(error.message)
        req.flash('alert-warning', `${error.message}`)
        res.redirect('/auth/login')
    }
   
}