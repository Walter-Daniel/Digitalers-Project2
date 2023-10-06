import bcrypt from 'bcryptjs';
import {config} from 'dotenv';
import Doctor from '../model/doctor.schema.js';
config();

export const createDoctor = async(req, res) => {

    const data = req.body;

    try {

        const doctor = new Doctor(data);
        const salt = bcrypt.genSaltSync();
        doctor.password = bcrypt.hashSync(data.password, salt);

        await doctor.save();

        res.status(201).json({
            ok: true,
            msg: 'Doctor creado con éxito',
            doctor
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error al crear un nuevo doctor',
            error: error.message
        });

    }
};


export const getDoctors = async(req, res) => {

   try {
        // const { limit = 10, from } = req.query;
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
        return res.render('doctor/listDoctors',{
            pageName: 'Lista de usuarios',
            doctors
        })
        return res.status(200).send({
                ok: true,
                message: 'Doctores obtenidos correctamente',
                doctors,
                totalPetition: doctors.length,
                total

        })

   } catch (error) {
        return res.status(500).send({
            ok: false,
            message: 'Error al obtener un doctor',
            error
        })
   }
};

export const updateDoctor = async(req, res) => {

    try {
        const {_id, password, email, ...rest }= req.body;
        const { id } = req.params;

        if( password ){
            const salt = bcrypt.genSaltSync();
            rest.password = bcrypt.hashSync(password, salt);
        }

        const doctor = await Doctor.findByIdAndUpdate( id, rest );

        return res.status(200).json({
            ok: true,
            message: 'Doctor actualizado con éxito',
            doctor
        });
    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: 'Error al intentar actualizar el doctor',
            error: error.message
        });
    }
};

export const deleteDoctor = async(req, res) => {
    try {
        
        const userID = req.params.id;
        const doctor = await Doctor.findByIdAndUpdate( userID, { active: false });

        return res.status(200).send({
            ok: true,
            message: 'Doctor eliminado con éxito',
            doctor,
        });

    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: 'Error al intentar eliminar el doctor',
            error
        });
    }
};