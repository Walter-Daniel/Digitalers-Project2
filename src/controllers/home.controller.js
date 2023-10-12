import { response } from "express";
import Doctor from '../model/doctor.schema.js';

export const home = async(req, res=response) => {

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
            doctors
        })
    } catch (error) {
        console.log(error)
    }
   
}