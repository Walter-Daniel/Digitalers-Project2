import { Schema, model } from 'mongoose';

const ImageSchema = Schema({
    title: {
        type: String,
    },
    url: {
        type: String,
    }
});

const ImageModel = model('Image', ImageSchema);
export default ImageModel;