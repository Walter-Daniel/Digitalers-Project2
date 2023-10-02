import mongoose,{ Schema, model } from 'mongoose';

const CategorySchema = new Schema({

    category: {
        type: String,
        required: [true, 'El rol es obligatorio']
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    doctors: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    }

});

const CategoryModel = model('Category', CategorySchema);

export default CategoryModel;