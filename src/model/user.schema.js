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
        minlength: 4, 
        maxlength: 25 
    },
    locality:{
        type: String,
        minlength: 4, 
        maxlength: 25 
    },
    phoneNumber:{
        type: String,
        minlength: 4, 
        maxlength: 25 
    },
    cellphone:{
        type: String,
        minlength: 4, 
        maxlength: 25 
    }
});
UserSchema.methods.toJSON = function(){
    const {  __v, password, ...user } = this.toObject();
    return user
}
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;