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
    // async function run() {
    //     try {
    //         const database = client.db("db_doctors");
    //         const appointment = database.collection("appointment");
            
    //         const doc = {
    //            clientID,
    //            doctorID,
    //            price,
    //            date,
    //            state
    //         };

    //         const filter = { clientID };
    //         const resp = await appointment.findOne(filter);
    //         if( resp.state === 'true' && idDoctor === resp.idDoctor ) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 msg: 'Usted ya tiene registrada una cita. Sí esto es un error, comuniquese con el administrador.'
    //             });
    //         }
    //         const result = await appointment.insertOne(doc);
    //         res.status(201).json({
    //             ok: true,
    //             msg: 'Usuario creado con éxito',
    //             result
    //         });
    //         await client.close();

    //     }catch(err) {
    //         res.status(500).json({
    //             ok: false,
    //             msg: 'Error al crear un nuevo usuario',
    //             err
    //         });
    //     }
    // }
    // run();
};

//SI EL ROL ES ADMIN => REDIRECCIONAR A LA PAG DE ADMINISTARCIÓN
//SI EL ROL ES DOCTOR => REDIRECCIONAR A LA PAGINA DE CITAS Y CONSULTAS
//SI EL ROL ES USER => REDIRECCIONAR AL INICIO + BOX DE BIENVENIDA

