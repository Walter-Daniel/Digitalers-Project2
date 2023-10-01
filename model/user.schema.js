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
        minlength: 5, 
        maxlength: 40 
    },
    lastname: { 
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 40 
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
    }
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;