
import mongoose, { Schema, model } from 'mongoose';

//Las primera cita medica la puede crear el usuario, las demas las crea, reprograma y elimina el medico.
//el usuario podra pedir la reprogramacion o eliminacion de la cita.


const AppointmentSchema = new Schema({
    date: { 
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String,
        required:true
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
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    }
}, { timestamps: { currentTime: () => new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }) } });

const AppointmentModel = model('Appointment', AppointmentSchema);

export default AppointmentModel;