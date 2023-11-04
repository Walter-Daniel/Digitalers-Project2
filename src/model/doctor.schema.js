import mongoose, { Schema } from 'mongoose';

const DoctorSchema = new mongoose.Schema({
    firstname: { 
        type: String, 
        required: true, 
        minlength: 4, 
        maxlength: 25 
    },
    lastname: { 
        type: String, 
        required: true, 
        minlength: 4, 
        maxlength: 25 
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        index: true, 
    },
    password: { 
        type: String, 
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    cellphone: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    consultingRoom: {
        type: String,
    },
    image: {
        type: String
    },
    active: {
        type: Boolean,
        default: true,
    },
    appointment:{
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    }
});
DoctorSchema.methods.toJSON = function(){
    const {  __v, password, ...doctor } = this.toObject();
    return doctor
}
const DoctorModel = mongoose.model('Doctor', DoctorSchema);

export default DoctorModel;