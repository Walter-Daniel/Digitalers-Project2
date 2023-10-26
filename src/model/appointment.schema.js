
import mongoose, { Schema, model } from 'mongoose';

let fecha = new Date();
console.log("Fecha en tu tiempo local: ",fecha.toLocaleString());
console.log("Milisegundos desde el unix epoch: ", fecha.getTime());

// La guardamos en una "base de datos" (Un objeto en memoria)
let baseDeDatos = {
  fechaGuardada: fecha
};

// Luego la recuperamos para su uso
let fechaGuardadaMilis = baseDeDatos.fechaGuardada;
let fechaObjeto = new Date(fechaGuardadaMilis);

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
        required: true
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
}, { timestamps: { currentTime: () => new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }) } });

const AppointmentModel = model('Appointment', AppointmentSchema);

export default AppointmentModel;