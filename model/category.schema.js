import { Schema } from 'mongoose';

const categorySchema = new Schema({
    name: string
});

export const categoryModel = mongoose.model('user', categorySchema);