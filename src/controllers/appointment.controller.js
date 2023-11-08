import { ObjectId } from 'mongodb';
import Appointment from '../model/appointment.schema.js';
import Doctor from '../model/doctor.schema.js';
import User from '../model/user.schema.js';
import jwt from 'jsonwebtoken';


export const renderCreate = async(req,res) => {
    res.render('appointment/create', {
        pageName: 'Crear cita',
        user: req.user,
        navbar: true,
        footer: true,
        edit: false,
    })
}
export const createAppointment = async(req, res) => {
    //si el paciente tiene una cita activa con el doctor, no se podra crear una nueva
    
    try {
        const { doctor, price, date, appointmentTime, client }= req.body;

        const user = req.user;
        
        if(user.role == 'DOCTOR_ROLE'){
            const appointment = new Appointment({ doctor, price, date, appointmentTime });
            await appointment.save();
            req.flash('alert-success', 'La cita ha sido creada con éxito');
            return res.redirect('/doctor/profile')
        }else if(user.role === 'ADMIN_ROLE'){
            const appointment = new Appointment({ doctor, price, date, appointmentTime, client });
            await appointment.save();
            req.flash('alert-success', 'La cita ha sido creada con éxito');
            return res.redirect('/appointment');
        }else {
            req.flash('alert-danger', 'No tienes permiso para crear una cita de otro doctor');
            res.redirect('/')
        }
    } catch (error) {
        
        req.flash('alert-danger', `${error.message},  holaaaaaaaaa`);
        res.redirect('/');
        
    }
};


//Consultas disponibles =>> las que no tengan un usuario designado y esten pendientes
//Citas que podran ver los pacientes y seleccionarlas
export const showConsultation = async(req, res) => {
    
    try {

        const {id} = req.params;
        const query = { client: undefined, status: 'Pending', doctor: id };

        const [ appointments, active ] = await Promise.all([
            Appointment.find(query).populate('doctor', '_id firstname lastname')
                            .populate('client', '_id firstname lastname')
                            .collation({ locale: 'es' })
                            .sort({ createdAt: -1 })
                            .lean()
                            .exec(),
            Appointment.find(query).countDocuments().lean()
        ]);

        appointments.forEach(function(item){
            return item.date = item.date.toISOString().split("T")[0]
        })

        return res.render('doctor/appointment',{
            ok: true,
            message: 'Citas obtenidas correctamente',
            appointments,
            active
        })

    } catch (error) {
        if(error) {
            return res.status(500).send({
                ok: false,
                message: 'Error al obtener cita',
                error
            })
        }
    }

};

export const getAppointment = async(req, res) => {

    const query = { active: true };
    const query2 = { active: false }

    try {
        const [ appointments, active, inactive ] = await Promise.all([
            Appointment.find().populate('doctor', '_id ')
                            .populate('client', '_id')
                            .collation({ locale: 'es' })
                            .sort({ date: -1 })
                            .lean(),
            Appointment.find(query).countDocuments(),
            Appointment.find(query2).countDocuments(),

        ]);

        appointments.forEach(function(item){
            return item.date = item.date.toISOString().split("T")[0]
        })
        return res.render('admin/appointment', {
            pageName: 'Lista de citas',
            appointments,
            total: appointments.length,
            active,
            inactive,
            user: req.user,
            navbar: true,
            footer: true
        })

    } catch (error) {
        if(error) {
            return res.status(500).send({
                ok: false,
                message: error.message,
                error
            })
        }
    }

};


export const renderUpdate = async(req,res) => {

    const { id } = req.params;
    try {

        const appointment = await Appointment.findById(id)
                                .populate('client', '_id')
                                .lean();

       const date = appointment.date.toISOString().split("T")[0]
        return res.render('appointment/update', {
            pageName: 'Editar cita',
            data: appointment,
            user: req.user,
            navbar: true,
            date,
            footer: true,
            edit: true
        })
    } catch (error) {
        req.flash('alert-danger', `${error.message}`)
        res.redirect(`/appointment/${id}`)
    }
    
}

export const updateAppointment = async(req, res) => {
   try {
    
    const { client, doctor, status, appointmentTime, date, price, active } = req.body;
    const { id } = req.params;
    const user = req.user;
    const query = { client, doctor, status: 'Confirmed' }

    const appointment = await Appointment.findById( id );
    const activeAppointment = await Appointment.find(query).countDocuments();

    if(activeAppointment >= 1){
        req.flah('alert-warning', 'Ya posee una cita agendada con el Doctor');
        return res.redirect(`/doctor/public/${id}`)
    }

    if(user.role === 'USER_ROLE' && !appointment.client){
        appointment.client = client;
        appointment.status = status;
        appointment.save();

        req.flash('alert-success', 'Se agendó la cita');
        return res.redirect(`/doctor/public/${id}`);
    }else if(user.role === 'USER_ROLE' && appointment.client){
        appointment.client = undefined;
        appointment.status = 'Pending';
        appointment.save();

        req.flash('alert-success', 'Se eliminó la cita de su agenda');
        return res.redirect(`/profile`);
    }else if(user.role == 'ADMIN_ROLE'){

        console.log(id, 'HOLAAAAAAAAAAAAA')
        const dataUpdate = {
            client, 
            doctor, 
            status,
            appointmentTime,
            date, 
            price, 
            active
        }
        await Appointment.findByIdAndUpdate( id, dataUpdate)
        req.flash('alert-success', 'Se ha creado la cita');
        return res.redirect('/appointment');
    }
   } catch (error) {
        console.log(error.message, 'holaaa')
        req.flash('alert-danger', `error.message`);
        res.redirect('/');
   }
};

export const deleteAppointment = async(req, res) => {
    try {

        const appointmentID = req.params.id;
        await Appointment.findByIdAndUpdate( appointmentID, { active: false });

        return res.status(200).send({
            ok: true,
            message: 'Cita eliminada con éxito',
        });

    } catch (error) {
        req.flash('alert-danger', `${error.message}`)
        res.redirect('/appointment')
    }
};