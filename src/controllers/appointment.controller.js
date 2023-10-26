import Appointment from '../model/appointment.schema.js';

export const createAppointment = async(req, res) => {
    //si el paciente tiene una cita activa con el doctor, no se podra crear una nueva
    const { client, doctor, price, category, reason } = req.body;

    try {
        const appointment = new Appointment({ client, doctor, price, category, reason });
        await appointment.save();

        // req.flash('alert-success', 'La cita ha sido creada con éxito');
        const { _doc } = appointment;
        const { createdAt, updatedAt, ...rest} = _doc;
        const actualDate = createdAt.toLocaleString();
        const actualUpdate = updatedAt.toLocaleString();

        const newAppointment = {
            createdAt: actualDate,
            updatedAt: actualUpdate,
            ...rest
        }
        res.json(newAppointment)
    } catch (error) {
        console.log(error.message)
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
    const infoUpdate = req.body;
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate( id, infoUpdate);
    // req.flash('alert-success', 'El usuario se ha editado con éxito!');
    // return res.redirect(`/user/profile/update/${id}`)
    return res.status(200).json({
        ok: true,
        message: 'Usuario actualizado con éxito',
        appointment
    });
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