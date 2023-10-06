import { response } from "express";

export const renderAdminPage = (req, res =response) => {

    res.render('profile/admin', {
        pageName: 'Administración',
    })
}