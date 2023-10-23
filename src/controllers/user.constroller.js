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

    // const token = req.cookies.token;

    // if (!token) {
    //     return res.status(401).send('Acceso no autorizado');
    // }

    // // Verifica y decodifica el token
    // jwt.verify(token, process.env.SECRETSEED, (err, decoded) => {
    //     if (err) {
    //     return res.status(401).send('Token no válido');
    //     }

    //     const userId = decoded.id;

    //     // Busca al usuario en la base de datos
    //     User.findById(id, (err, user) => {
    //     if (err || !user) {
    //         return res.status(401).send('Usuario no encontrado');
    //     }

    //     res.json({ username: user.firstname });
    //     });
    // });
    // const user = await User.findById(id).lean();

    // if(role === 'ADMIN_ROLE'){
    //     res.render('profile/admin', {
    //         pageName: 'Administración',
    //     })
    // }else if(role === 'USER_ROLE'){
    //     res.render('profile/user', {
    //         pageName: 'Perfil del Usuario',
    //         user
    //     })
    // }
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

export const updateUser = async(req=request, res) => {

    
    // const user = await User.findByIdAndUpdate( id, secure_url, rest);

try {
    // const {_id, password, email, ...rest }= req.body;
    // const { id } = req.params;
    // // const imgPath = req.files.image.tempFilePath

    // if( password ){
    //     const salt = bcrypt.genSaltSync();
    //     rest.password = bcrypt.hashSync(password, salt);
    // }

    // if (uploadedFile.mimetype !== 'image/jpeg') {
    //     return res.status(400).send('Only JPG files are allowed.');
    // }

    const imgPath = req.files.image.tempFilePath
    const resp =  await cloudinary.uploader.upload(imgPath);
    return res.json(resp)



    // return res.status(200).json({
    //     ok: true,
    //     message: 'Usuario actualizado con éxito',
    //     user
    // });
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