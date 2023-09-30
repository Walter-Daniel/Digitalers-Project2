import { Schema } from 'mongoose';

const UserSchema = new Schema({
    firstname:String,
    lastname: String,
    email: String,
    active: Boolean
});

export const UserModel = mongoose.model('User', UserSchema);