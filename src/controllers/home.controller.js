import { response } from "express";

export const home = (req, res=response) => {
    res.render('home', {
        pageName: 'Medical Digitalers',
        navbar: true,
        renderHero: true
    })
}