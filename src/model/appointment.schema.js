import { Schema } from 'mongoose';

//Las primera cita medica la puede crear el usuario, las demas las crea, reprograma y elimina el medico.
//el usuario podra pedir la reprogramacion o eliminacion de la cita.

const appointmentSchema = new Schema({
    date: { 
        type: date, 
        required: true, 
    },
    reason: { 
        type: String, 
        required: true, 
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    createBy: {
        type: String,
        required: true
    }
});

export const appointmentModel = mongoose.model('Appointment', appointmentSchema);