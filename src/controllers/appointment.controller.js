import Appointment from '../model/appointment.schema.js';
import Doctor from '../model/doctor.schema.js';

export const createAppointment = async(req, res) => {
    //si el paciente tiene una cita activa con el doctor, no se podra crear una nueva
    const { doctor, price, date, appointmentTime }= req.body;
    try {
        const appointment = new Appointment({ doctor, price, date, appointmentTime });
        await appointment.save();

        req.flash('alert-success', 'La cita ha sido creada con éxito');
        const { _doc } = appointment;
        const { createdAt, updatedAt, ...rest} = _doc;
        const actualDate = createdAt.toLocaleString();
        const actualUpdate = updatedAt.toLocaleString();

        const newAppointment = {
            createdAt: actualDate,
            updatedAt: actualUpdate,
            ...rest
        }
        res.json(appointment)
    } catch (error) {
        console.log(error.message)
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

        if(appointments.length === 0){
            return res.status(404).send({
                ok: true,
                message: 'No se encontró ninguna cita'
            })
        }

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
        const [ appointments, activos, inactivos ] = await Promise.all([
            Appointment.find(query).populate('doctor', '_id firstname lastname')
                            .populate('client', '_id firstname lastname')
                            .collation({ locale: 'es' })
                            .sort({ createdAt: -1 }),
            Appointment.find(query).countDocuments(),
            Appointment.find(query2).countDocuments(),

        ]);

        if(appointments.length === 0){
            return res.status(404).send({
                ok: true,
                message: 'No se encontró ninguna cita'
            })
        }

        return res.status(200).send({
            ok: true,
            message: 'Citas obtenidas correctamente',
            appointments,
            activos,
            inactivos
        })

    } catch (error) {
        if(error) {
            return res.status(500).send({
                ok: false,
                message: 'Error al obtener usuario',
                error
            })
        }
    }

};

export const updateAppointment = async(req, res) => {
   try {
    
    const { client, doctor } = req.body;
    const { id } = req.params;

    // const appointment = await Appointment.findById( id );
    // if(!appointment){
    //     return res.json('No hay cita')
    // }

    const query = { client, doctor, status: 'Pending' };
    const active = await Appointment.find(query).countDocuments();

    if(active >= 1){
        return res.json('Ya posee una cita agendada con el Doctor');
    }

    console.log(appointments, active)
    // req.flash('alert-success', 'El usuario se ha editado con éxito!');
    // return res.redirect(`/user/profile/update/${id}`)

    // appointment.client = client;
    // appointment.save();
    // return res.status(200).json({
    //     ok: true,
    //     message: 'Usuario actualizado con éxito',
    //     appointment
    // });
   } catch (error) {
        console.log(error.message)
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