import { Schema } from 'mongoose';

const appointmentSchema = new Schema({
    //Se tiene que asociar al usario y al doctor
    confirm: Boolean,
    date: Date.now(),
});

export const appointmentModel = mongoose.model('appointment', appointmentSchema);