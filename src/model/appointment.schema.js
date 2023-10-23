import { Schema } from 'mongoose';

//Las primera cita medica la puede crear el usuario, las demas las crea, reprograma y elimina el medico.
//el usuario podra pedir la reprogramacion o eliminacion de la cita.

const appointmentSchema = new Schema({
    //Se tiene que asociar al usario y al doctor
    date: { 
        type: date, 
        required: true, 
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    active: {
        type: Boolean,
        default: true
    }
});

export const appointmentModel = mongoose.model('Appointment', appointmentSchema);