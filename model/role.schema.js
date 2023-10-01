import { Schema, model } from 'mongoose';

const RoleSchema = Schema({

    role: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }

});

const Role = model( 'Role', RoleSchema );

export default Role;