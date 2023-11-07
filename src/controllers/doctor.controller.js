import bcrypt from 'bcryptjs';
import {config} from 'dotenv';
import Doctor from '../model/doctor.schema.js';
import Appointment from '../model/appointment.schema.js';
import Category from '../model/category.schema.js';
import Role from '../model/role.schema.js';

import jwt from 'jsonwebtoken';

config();

//Render public profile
export const renderProfile = async(req, res) => {

    const {id} = req.params;
    try {

        const doctor = await Doctor.findById(id).lean()

        if(!doctor){
            req.flash('alter-warning', 'No se pudo encontrar al doctor')
            res.redirect('/')
            return
        };

        const query = { client: undefined, status: 'Pending', doctor: id };
        const [ appointments, active ] = await Promise.all([
            Appointment.find(query).populate('doctor', '_id firstname lastname')
                            .populate('client', '_id firstname lastname')
                            .collation({ locale: 'es' })
                            .sort({ date: -1 })
                            .lean()
                            .exec(),
            Appointment.find(query).countDocuments().lean()
        ]);

        appointments.forEach(function(item){
            return item.date = item.date.toISOString().split("T")[0]
        })

        res.render('doctor/public',{
            pageName: 'Perfil del Doctor',
            navbar: true,
            footer: true,
            user: req.user,
            doctor,
            appointments,
            total: appointments.length, 
            active
        })
    } catch (error) {
        req.flash('alert-info', `${error.message}`)
        res.redirect(`/doctor/public/${id}`)
    }   
}

//Render private profile
export const renderPrivateProfile = async(req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            req.flash('alert-warning', 'Acceso no autorizado')
            return res.redirect('/auth/login')
        }
        const { id } = jwt.verify( token, process.env.SECRETSEED );
        const user = await Doctor.findById(id).lean();

        if(!user){
            req.flash('alert-warning', 'Error al encontrar doctor');
            res.redirect('/auth/login');
            return
        };

        //Find doctor's appointment in DB
        const query = { client: undefined, status: 'Pending', doctor: id };
        const query2 = { status: 'Confirmed', doctor: id };

        const [ appointment, confirmed ] = await Promise.all([
            Appointment.find(query).populate('client', '_id firstname lastname')
                            .collation({ locale: 'es' })
                            .sort({ date: -1 })
                            .lean()
                            .exec(),
            Appointment.find(query2).populate('client', '_id firstname lastname')
                            .collation({ locale: 'es' })
                            .sort({ date: -1})
                            .lean()
                            .exec(),
        ]);
        appointment.forEach(function(item){
            return item.date = item.date.toISOString().split("T")[0]
        })
        confirmed.forEach(function(item){
            return item.date = item.date.toISOString().split("T")[0]
        })
          

        res.render('profile/doctor',{
            pageName: 'Perfil del Doctor',
            navbar: true,
            footer: true,
            appointmentTotal: appointment.length,
            appointment,
            appointmentTota: appointment.length,
            confirmed,
            confirmedTotal: confirmed.length,
            user
        })
    } catch (error) {
        res.json(error.message);
    }
}
// Renderizado del formulario y registro de un DOCTOR
export const renderFormCreate = async(req,res) => {

    const categories = await Category.find({}).lean();
    const roles = await Role.find({}).lean();
    res.render('doctor/createDoctor',{
        pageName: 'Registrar un nuevo Doctor',
        data: {
            categories,
            roles   
        },
        create: true,
        navbar: true,
        footer: true,
        user: req.user
    })
}

export const createDoctor = async(req, res) => {

    const data = req.body;

    try {

        const doctor = new Doctor(data);
        const salt = bcrypt.genSaltSync();
        doctor.password = bcrypt.hashSync(data.password, salt);

        await doctor.save();

        req.flash('alert-success', 'se ha creado un nuevo doctor');

        res.render('doctor/createDoctor', {
            pageName: 'Registrar un nuevo Doctor',
            messages: req.flash(),
            user: req.user,
            create: true,
            navbar: true,
            footer: true
        })

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
        const query = { role: 'DOCTOR_ROLE' };
        const query2 = { role: 'DOCTOR_ROLE', active: true };
        const query3 = { role: 'DOCTOR_ROLE', active: false };
        const [doctors, doctorActive, doctorInactive] = await Promise.all([
            Doctor.find(query).lean().sort({ active: -1 }),           
            Doctor.count(query2),
            Doctor.count(query3),
        ]);

        // return res.json(doctors)

        return res.render('doctor/listDoctors',{
            pageName: 'Lista de médicos',
            doctors,
            doctorsTotal: doctors.length,
            doctorActive,
            doctorInactive,
            navbar: true,
            user: req.user,
            footer: true
        })

   } catch (error) {
        return res.status(500).send({
            ok: false,
            message: 'Error al obtener un doctor',
            error
        })
   }
};

// Renderizado del formulario y registro de un DOCTOR
export const renderFormUpdate = async(req,res) => {

    try {
        const user = req.user;
        const { id } = req.params;

        const doctor = await Doctor.findById(id).lean();

        res.render('doctor/updateDoctor', {
            pageName: 'Editar Doctor',
            data: doctor,
            user,
            navbar: true,
            edit: true,
            footer: true
        })
    } catch (error) {
        req.flash('alert-danger', `${error.message}`);
        return res.redirect(`/doctor/${id}`);
    }
}

export const updateDoctor = async(req, res) => {

    try {
        const {_id, password, email, ...rest }= req.body;
        const { id } = req.params;

        if( password ){
            const salt = bcrypt.genSaltSync();
            rest.password = bcrypt.hashSync(password, salt);
        }

        const doctor = await Doctor.findByIdAndUpdate( id, rest );
        req.flash('alert-success', 'Información modificada con éxito');

        return res.render('doctor/updateDoctor', {
            pageName: 'Editar Doctor',
            messages: req.flash(),
            edit: true,
            navbar: true,
            footer: true,
            data: req.body,
            user: req.user,
        })

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

        return res.status(200).json({
            ok: true,
            message: 'Se ha dado de baja al Doctor',
            doctor
        });

    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: 'Error al intentar eliminar el doctor',
            error
        });
    }
};