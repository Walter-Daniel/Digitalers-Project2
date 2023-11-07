import Appointment from '../model/appointment.schema.js';
import Doctor from '../model/doctor.schema.js';
import User from '../model/user.schema.js';
import jwt from 'jsonwebtoken';


export const renderCreate = async(req,res) => {
    res.render('appointment/create', {
        pageName: 'Crear cita',
        user: req.user,
        navbar: true,
        footer: true
    })
}
export const createAppointment = async(req, res) => {
    //si el paciente tiene una cita activa con el doctor, no se podra crear una nueva
    
    try {
        const { doctor, price, date, appointmentTime, client }= req.body;

        const user = req.user;
        const id = user._id;

        console.log(id)
        
        const isdoctor = await Doctor.findById( doctor );
        const isAdmin = await User.find({ '_id': id, role:'ADMIN_ROLE' });
        const isClient = await User.findById(client);

        if(!isdoctor){
            if(user.role === 'DOCTOR_ROLE'){
                req.flash('alert-danger', 'No tienes permiso para crear una cita de otro doctor');
                return res.redirect('/doctor/profile');
            }else if(user.role === 'ADMIN_ROLE' ){
                req.flash('alert-danger', 'No se encontro doctor con ese ID');
                return res.redirect('/appointment/create');
            }
        }

        if(user.role === 'DOCTOR_ROLE' && user.role !== isdoctor.role){
            req.flash('alert-danger', 'No tienes permiso para crear una cita de otro doctor');
            return res.redirect('/doctor/profile')
        }

        if(!isClient){
            req.flash('alert-danger', 'No se encontro paciente con ese ID');
            return res.redirect('/appointment/create');
        }
        
        if(user.role == 'DOCTOR_USER'){
            const appointment = new Appointment({ doctor, price, date, appointmentTime });
            await appointment.save();
            req.flash('alert-success', 'La cita ha sido creada con éxito');
            res.redirect('/doctor/profile')
        }else if(user.role === 'ADMIN_ROLE'){
            const appointment = new Appointment({ doctor, price, date, appointmentTime, client });
            await appointment.save();
            req.flash('alert-success', 'La cita ha sido creada con éxito');
            res.redirect('/appointment/create');
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
        console.log(error, 'error desde appointment')
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
            Appointment.find(query).populate('doctor', '_id firstname lastname')
                            .populate('client', '_id firstname lastname')
                            .collation({ locale: 'es' })
                            .sort({ createdAt: -1 })
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

export const updateAppointment = async(req, res) => {
   try {
    
    const { client, doctor, status } = req.body;
    const { id } = req.params;
    const user = req.user;

    const appointment = await Appointment.findById( id );
    if(!appointment){
        return res.json('No hay cita')
    }

    const query = { client, doctor, status: 'Confirmed' };
    const active = await Appointment.find(query).countDocuments();

    if(active >= 1){
        if(user.role === 'USER_ROLE'){
            req.flash('alert-warning', 'Ya posee una cita agendada con el Doctor');
            return res.redirect(`/doctor/public/${doctor}`);   
        }
    }

    if(!appointment.client){
        appointment.client = client;
        appointment.status = status;
        appointment.save();
        req.flash('alert-success', 'La cita ha sido creada con éxito');
        if(user.role === 'USER_ROLE'){
            return res.redirect(`/doctor/public/${doctor}`);
        }
    }else if(appointment.client.toString() === client){
        appointment.client = undefined;
        appointment.status = status;
        appointment.save();
        req.flash('alert-success', 'La cita ha sido eliminada con éxito!');
        res.redirect('/user/profile');
    }else if( appointment.client.toHexString() !== client && user.role === 'SECRETARY_ROLE' || user.role === 'ADMIN_ROLE' ){
        appointment.client = client;
        appointment.save();
        if(user.role=== 'ADMIN_ROLE'){
           res.redirect('/appointment/creat')
        }else{
            res.json('sos secretaria')
        }
    };
   } catch (error) {
        console.log(error.message)
        req.flash('alert-danger', `error.message`);
        res.redirect('/');
   }
};

export const deleteAppointment = async(req, res) => {
    try {

        const appointmentID = req.params.id;
        const appointment = await Appointment.findByIdAndUpdate( appointmentID, { active: false });

        return res.status(200).send({
            ok: true,
            message: 'Usuario eliminado con éxito',
            appointment,
        });

    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: 'Error al intentar eliminar el usuario',
            error
        });
    }
};