import Role from '../model/role.schema.js';
import User from '../model/user.schema.js';
import Category from '../model/category.schema.js';
import Doctor from '../model/doctor.schema.js';
import Admin from '../model/user.schema.js';
import { response } from 'express';

export const isRole = async(role = '', {req})  => {
    role = req.user.role
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
    const existDoctor = await Doctor.findById( id );
    const existAdmin = await Admin.find({ '_id': id, 'role': 'ADMIN_ROLE' });
    if( !existUser && !existDoctor && !existAdmin ){
        throw new Error(`El id: ${id} no existe.`);
    }
};

export const findID = ( Model ) => {

    return async (req, res, next) => {
        
        const { id } = req.params;
        switch (Model) {
            case Doctor:
                const doctorID = await Doctor.findById(id)
                if( !doctorID ){
                    res.json({
                        ok: false,
                        msg: `El id: ${id} no existe.`
                    });
                }        
                break;
            case User:
                const userID = await Doctor.findById(id)
                if( !userID ){
                    res.json({
                        ok: false,
                        msg: `El id: ${id} no existe.`
                    });
                }        
                break;
        }
        next();
    }        
};

export const fromControl = async( from ) => {
    const isINT = parseInt(from);
    if(isNaN(isINT)){
        throw new Error(`From: ${from} es inválido. Por favor, ingrese un número.`);
    }
}

export const isAdmin = async( role ) => {
    if(role !== 'ADMIN_ROLE'){
        throw new Error('No posees los permisos para realizar la siguiente accion');
    }
};

export const setCategory = async( category = '' ) => {
    const existCategory = await Category.findOne({ category });
    if(!existCategory){
        throw new Error('Elige una categoría válida');
    }
};