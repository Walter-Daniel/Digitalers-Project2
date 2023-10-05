import bcrypt from 'bcryptjs';
import {config} from 'dotenv';
import User from '../model/user.schema.js';
import { response } from 'express';
config();

export const createUser = async(req, res=response) => {

    const { firstname, lastname, email, password, role } = req.body;

    try {

        const user = new User({firstname, lastname, email, password, role });
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        req.flash('alert-success', 'Su cuenta ha sido creada con éxito');

        // res.status(201).json({
        //     ok: true,
        //     msg: 'Usuario creado con éxito',
        //     user
        // });

        res.render('auth/register', {
            pageName: 'Registro',
            messages: req.flash()
        })
        return;

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error al crear un nuevo usuario',
            error: error.message
        });

    }
};

export const renderUserProfile = (req, res=response) => {

    const { role } = req.user;

    if(role === 'ADMIN_ROLE'){
        res.render('profile/admin', {
            pageName: 'Administración',
        })
    }else if(role === 'USER_ROLE'){
        res.render('profile/user', {
            pageName: 'Perfil del Usuario',
        })
    }
}
export const getUsers = async(req, res) => {

   try {
        const { limit = 10, from } = req.query;
        const query = { active: true }

        const [users, total] = await Promise.all([
            User.find(query)
                .skip(Number(from))
                .limit(Number(limit)),
            User.count(query)
        ]);

        if(users.length === 0){
            return res.status(404).send({
                ok: true,
                message: 'No se encontró ningun usuario'
            })
        }

        return res.status(200).send({
                ok: true,
                message: 'Usuarios obtenidos correctamente',
                users,
                totalPetition: users.length,
                total

        })

   } catch (error) {
        return res.status(500).send({
            ok: false,
            message: 'Error al obtener usuario',
            error
        })
   }
};

export const updateUser = async(req, res) => {

try {
    const {_id, password, email, ...rest }= req.body;
    const { id } = req.params;

    if( password ){
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate( id, rest );

    return res.status(200).json({
        ok: true,
        message: 'Usuario actualizado con éxito',
        user
    });
} catch (error) {
    return res.status(500).send({
        ok: false,
        message: 'Error al intentar actualizar el usuario',
        error: error.message
    });
}
};

  //El usuario no se elimina de la DB para mantener la integridad referencial, se modifica su 'active': false
  //La petición para traer los usuarios, trae a todos menos a los usuarios con 'active': false.
export const deleteUser = async(req, res) => {
    try {
        
        const userID = req.params.id;
        const user = await User.findByIdAndUpdate( userID, { active: false });

        return res.status(200).send({
            ok: true,
            message: 'Usuario eliminado con éxito',
            user,
        });

    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: 'Error al intentar eliminar el usuario',
            error
        });
    }
};