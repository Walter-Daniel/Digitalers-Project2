import bcrypt from 'bcryptjs';
import {config} from 'dotenv';
import User from '../model/user.schema.js';
import Doctor from '../model/doctor.schema.js';
import Appointment from '../model/appointment.schema.js';
import { request, response } from 'express';
import jwt from 'jsonwebtoken';
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

    const token = req.cookies.token;
    if (!token) {
        req.flash('alert-warning', 'Acceso no autorizado')
        return res.redirect('/auth/login')
    }

    const { id } = jwt.verify( token, process.env.SECRETSEED );
    const user = await User.findById(id).lean();

    if(!user){
        req.flash('alert-warning', 'Error al encontrar usuario')
        return res.redirect('/auth/login')
    }
    const query = { client: user._id };
    const appointment  = await Appointment.find(query).populate('doctor', 'firstname lastname category')
                                                      .collation({ locale: 'es' })
                                                      .lean();
    appointment.forEach(function(item){
        return item.date = item.date.toISOString().split("T")[0]
    })                                                  
    return res.render('profile/user', {
             pageName: 'Perfil del Usuario',
             navbar: true,
             user,
             appointment,
             appointmentTotal: appointment.length
         });
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

    //Eliminar las paginas previas anteriores y guardar la actual
    delete req.session.prevUrl;
    req.session.prevUrl = req.originalUrl;
    res.render('profile/form', {
        pageName: 'Editar Perfil del Usuario',
        navbar: true,
        user
    })

}
export const updateUser = async(req=request, res) => {

try {
    const {_id, password, email,...rest }= req.body;
    const { id } = req.params;

    if( password ){
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
    }

    // const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    // if (!passwordMatch) {
    //     return res.status(401).send('Current password is incorrect');
    // }

    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // user.password = hashedPassword;

    // user.cellphone = cellphone;
    // await user.save();

    const user = await User.findByIdAndUpdate( id, rest);
    req.flash('alert-success', 'El usuario se ha editado con éxito!');
    return res.redirect(`/user/profile/update/${id}`)
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