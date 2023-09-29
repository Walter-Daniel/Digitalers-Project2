import { Schema } from 'mongoose';

const userSchema = new Schema({
    firstname:String,
    lastname: String,
    email: String
});

export const userModel = mongoose.model('user', userSchema);