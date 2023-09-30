import { Schema } from 'mongoose';

const categorySchema = new Schema({
    name: string,
    active: Boolean,
    require: true
    //Relacion con los doctores
});

export const categoryModel = mongoose.model('user', categorySchema);