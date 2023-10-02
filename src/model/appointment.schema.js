import { Schema } from 'mongoose';

//Las primera cita medica la puede crear el usuario, las demas las crea, reprograma y elimina el medico.
//el usuario podra pedir la reprogramacion o eliminacion de la cita.

const appointmentSchema = new Schema({
    //Se tiene que asociar al usario y al doctor
    date: Date.now(),
    acive: Boolean,
    require: true
});

export const appointmentModel = mongoose.model('appointment', appointmentSchema);