import { Schema } from 'mongoose';

const appointmentSchema = new Schema({
    //Se tiene que asociar al usario y al doctor
    date: Date.now(),
    acive: Boolean,
    require: true
});

export const appointmentModel = mongoose.model('appointment', appointmentSchema);