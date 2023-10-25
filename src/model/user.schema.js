import mongoose from 'mongoose';

const VALID_ROLES = [
    'ADMIN_ROLE',
    'USER_ROLE',
    'DOCTOR_ROLE'
];

const UserSchema = new mongoose.Schema({
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
    active: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: VALID_ROLES,
        default: VALID_ROLES[1],
    },
    image: {
        type: String
    },
    adress:{
        type: String,
        maxlength: 25,
        default: "" 
    },
    locality:{
        type: String,
        maxlength: 25,
        default: "" 
    },
    phoneNumber:{
        type: String,
        maxlength: 15,
        default: "" 
    },
    cellphone:{
        type: String,
        maxlength: 15,
        default: ""
    }
});
UserSchema.methods.toJSON = function(){
    const {  __v, password, ...user } = this.toObject();
    return user
}
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;