import { Schema } from 'mongoose';

const doctorSchema = new Schema({
    //Se tiene que asociar a categoría
    name: String,
    lastname: String,
    email: String,
    category: String,
});

export const doctorModel = mongoose.model('appointment', doctorSchema);