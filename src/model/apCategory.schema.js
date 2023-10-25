import mongoose,{ Schema, model } from 'mongoose';

const ApCategorySchema = new Schema({

    category: {
        type: String,
        required: [true, 'La categoría de la cita es obligatoria']
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },

});

const ApCategoryModel = model('ApCategory', ApCategorySchema);

export default ApCategoryModel;