import { response } from "express";
import User from '../model/user.schema.js';
import Doctor from '../model/doctor.schema.js';
import Appointment from '../model/appointment.schema.js';

export const renderAdminPage = async(req, res =response) => {

    const [ appointments, doctors, users ] = await Promise.all([
        Appointment.find({}).countDocuments(),
        Doctor.find({}).countDocuments(),
        User.find({}).countDocuments()
    ]);


    res.render('admin/dashboard', {
        pageName: 'Dashboard',
        user: req.user,
        navbar: true,
        footer: true,
        appointments,
        users,
        doctors
    })
}