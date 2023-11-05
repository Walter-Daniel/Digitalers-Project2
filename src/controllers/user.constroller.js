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

export const renderCreateUser = async(req, res) => {
    res.render('user/create', {
        pageName: 'Crear Usuario',
        user: req.user,
        navbar: true
    })
}
export const createUser = async(req, res=response) => {

    const { firstname, lastname, email, password, role, adress, locality, phoneNumber, cellphone } = req.body;
    
    try {
        const isRole = req.user.role;
        let user = '';

        if(isRole === 'ADMIN_ROLE'){
            user = new User({firstname, lastname, email, password, role, adress, locality, phoneNumber, cellphone });
        }else{
            user = new User({firstname, lastname, email, password, role });
        }

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        await user.save();

        if(isRole === 'ADMIN_ROLE'){
            req.flash('alert-success', 'El paciente ha sido registrado con éxito');
            res.redirect('/user') 
        }else{
            req.flash('alert-success', 'Su cuenta ha sido creada con éxito');
            res.redirect('/auth/register')
        }
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

    console.log(user, 'desde usuario')

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

//Render user list
export const getUsers = async(req, res) => {
   try {
        const { limit = 10, from } = req.query;
        const query = { active: false }

        const [users, inactive] = await Promise.all([
            User.find({})
                .skip(Number(from))
                .limit(Number(limit))
                .lean(),
            User.count(query)
        ]);

        if(users.length === 0){
            return res.status(404).send({
                ok: true,
                message: 'No se encontró ningun usuario'
            })
        };

        return res.render('admin/user', {
            pageName: 'Lista de pacientes',
            navbar: true,
            user: req.user,
            users,
            total: users.length,
            active: (users.length - inactive),
            inactive
        });
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
        data: user,
        user: req.user
    })

}
export const updateUser = async(req=request, res) => {

try {
    const {password, email, newPassword, confirmPassword, ...rest }= req.body;
    const { id } = req.params;

    const currentUser = await User.findById(id);

    if(!password){
        await User.findByIdAndUpdate( id, rest);
        req.flash('alert-success', 'El usuario se ha editado con éxito!');
        return res.redirect(`/user/profile/update/${id}`)
    };

    const userPassword = currentUser.password;

    console.log(newPassword, confirmPassword)
    const passwordMatch = await bcrypt.compare(password, userPassword);
    if(!passwordMatch){
        req.flash('alert-danger', 'Tu contraseña es inválida, intentalo de nuevo.');
        return res.redirect(`/user/profile/update/${id}`);
    };

    if(newPassword !== confirmPassword){
        req.flash('alert-danger', 'Contraseñas no coinciden');
        return res.redirect(`/user/profile/update/${id}`);
    };

    const hashedPassword = await bcrypt.hash(confirmPassword, 10);
 
    const dataUpdate = {
        hashedPassword,
        ...rest
    }
   
    await User.findByIdAndUpdate( id, dataUpdate);
    req.flash('alert-danger', 'Tu contraseña es inválida, intentalo de nuevo.');
    return res.redirect(`/user/profile/update/${id}`);
    
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