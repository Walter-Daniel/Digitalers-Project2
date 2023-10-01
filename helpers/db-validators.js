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
};

export const findUserId = async( id ) => {
    const existUser= await User.findById( id );
    if( !existUser ){
        throw new Error(`El id: ${id} no existe.`);
    }
};

export const fromControl = async( from ) => {
    const isINT = parseInt(from);
    if(isNaN(isINT)){
        throw new Error(`From: ${from} es inválido. Por favor, ingrese un número.`);
    }
}