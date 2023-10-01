import Role from '../model/role.schema.js';
import User from '../model/user.schema.js';

export const isRole = async(role = '')  => {
    const existRol = await Role.findOne({ role });
    if(!existRol){
        throw new Error('El rol no está registrado en la base de datos');
    }
};

export const emailExist = async(email = '') => {
    const findEmail = await User.findOne({ email });
    if( findEmail ){
        throw new Error('El correo ya se encuentra registrado');
    }
}