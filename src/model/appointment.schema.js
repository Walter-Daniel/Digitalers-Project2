
import mongoose, { Schema, model } from 'mongoose';

//Las primera cita medica la puede crear el usuario, las demas las crea, reprograma y elimina el medico.
//el usuario podra pedir la reprogramacion o eliminacion de la cita.

const status = [
    'Pending',
    'Placed',
    'Cancelled',
];


const AppointmentSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    reason: { 
        type: String, 
        default: "",
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: status,
        default: status[0],
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    }
}, { timestamps: { currentTime: () => new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }) } });

const AppointmentModel = model('Appointment', AppointmentSchema);

export default AppointmentModel;