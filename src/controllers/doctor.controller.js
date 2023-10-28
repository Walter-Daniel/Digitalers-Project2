import bcrypt from 'bcryptjs';
import {config} from 'dotenv';
import Doctor from '../model/doctor.schema.js';
import Category from '../model/category.schema.js';
import Role from '../model/role.schema.js'
config();

//Render public profile
export const renderProfile = async(req, res) => {

    const {id} = req.params;
    const doctor = await Doctor.findById(id).lean();

    if(!doctor){
        req.flash('alter-warning', 'No se pudo encontrar al doctor')
        res.render('/')
        return
    };

    res.render('publicProfile',{
        pageName: 'Perfil del Doctor',
        navbar: true,
        user: req.user,
        doctor
    })
}

// Renderizado del formulario y registro de un DOCTOR
export const renderFormCreate = async(req,res) => {

    const categories = await Category.find({}).lean();
    const roles = await Role.find({}).lean();
    res.render('doctor/create',{
        pageName: 'Registrar un nuevo Doctor',
        data: {
            categories,
            roles,
            create: 'create'

        }
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

        res.render('doctor/create', {
            pageName: 'Registrar un nuevo Doctor',
            messages: req.flash()
        })

        // res.status(201).json({
        //     ok: true,
        //     msg: 'Doctor creado con éxito',
        //     doctor
        // });

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
            doctors,
            navbar: true
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

// Renderizado del formulario y registro de un DOCTOR
export const renderFormUpdate = async(req,res) => {

    try {
        const user = req.user;
        const { id } = req.params;

        const doctor = await Doctor.findById(id).lean();

        res.render('doctor/create', {
            pageName: 'Editar Doctor',
            data: doctor,
            user,
            navbar: true,
            edit: true
        })
    } catch (error) {
        req.flash('alert-danger', 'No se encontro un Doctor')
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
        req.flash('alert-success', 'Información editada con éxito');

        return res.render('doctor/create', {
            pageName: 'Editar Doctorr',
            messages: req.flash(),
            edit: true,
            navbar: true,
            data: req.body
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