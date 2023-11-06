import { response } from "express";
import Doctor from '../model/doctor.schema.js';
import User from '../model/user.schema.js';
import jwt from 'jsonwebtoken';
import handlebars from "express-handlebars";

export const home = async(req, res=response) => {

    const user = req.user;
    try {

        const query = { active: true }
        const [doctors, total] = await Promise.all([
            Doctor.find(query).lean(),
               
            Doctor.count(query)
        ]);
        
        res.render('home', {
            pageName: 'Clínica del Sol',
            navbar: true,
            renderHero: true,
            footer: true,
            doctors,
            total,
            user
        })
    } catch (error) {
        console.log(error.message)
        req.flash('alert-warning', `${error.message}`)
        res.redirect('/auth/login')
    }
   
}