import { response } from "express";
import Doctor from '../model/doctor.schema.js';
import User from '../model/user.schema.js';
import jwt from 'jsonwebtoken';

export const home = async(req, res=response) => {

    let user;
    try {
        const token = req.cookies.token;
        if (!token) {
            user = "P";
        }
        await jwt.verify(token, process.env.SECRETSEED, async(err, decoded) => {
            if (err) {
            return res.status(401).send(err);
            }
        
            const id = decoded.id;
            const userDB = await User.findById(id).lean();
            if(!userDB){
                throw new Error( 'Acceso denegado' )
            }

            user = userDB;
            return user;
        });

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
        console.log(error)
    }
   
}