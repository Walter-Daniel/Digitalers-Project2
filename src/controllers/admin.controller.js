import { response } from "express";

export const renderAdminPage = (req, res =response) => {

    res.render('admin/dashboard', {
        pageName: 'Dashboard',
        user: req.user,
        navbar: true,
        footer: true
    })
}