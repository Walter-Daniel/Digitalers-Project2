import bcrypt from 'bcryptjs';
import {config} from 'dotenv';
import User from '../model/user.schema.js';
import { request, response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL )
config();

export const createUser = async(req, res=response) => {

    const { firstname, lastname, email, password, role } = req.body;

    try {

        const user = new User({firstname, lastname, email, password, role });
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        req.flash('alert-success', 'Su cuenta ha sido creada con éxito');

        res.render('auth/register', {
            pageName: 'Registro',
            messages: req.flash()
        })
        return;

    } catch (error) {
        req.flash('alert-danger', `${error.message}`);
        res.render('auth/register', {
            pageName: 'Registro',
            messages: req.flash()
        })
    }
};

export const renderUserProfile = async(req=request, res=response) => {

    const { id } = req.user;
    const user = await User.findById(id).lean();

    if(user.role === 'ADMIN_ROLE'){
        res.render('profile/admin', {
            pageName: 'Administración',
        })
    }else if(user.role === 'USER_ROLE'){
        res.render('profile/user', {
            pageName: 'Perfil del Usuario',
            user
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


//UPDATE USER
export const updateUserFormRender = async(req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).lean();

    res.render('profile/form', {
        pageName: 'Editar Perfil del Usuario',
        navbar: true,
        user
    })

}
export const updateUser = async(req=request, res) => {

try {
    const {_id, password, email, ...rest }= req.body;
    const { id } = req.params;

    if( password ){
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
    }

    if (uploadedFile.mimetype !== 'image/jpeg') {
        return res.status(400).send('Only JPG files are allowed.');
    }


    const user = await User.findByIdAndUpdate( id, secure_url, rest);

    return res.status(200).json({
        ok: true,
        message: 'Usuario actualizado con éxito',
        user
    });
} catch (error) {
    return res.status(500).send({
        ok: false,
        // message: 'Error al intentar actualizar el usuario',
        error: error
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