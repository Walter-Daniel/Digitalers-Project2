import { response } from "express";

export const tokenInHeader = ((req, res=response, next) => {
    const token = req.cookies.token;
    if(!token){
      return res.redirect('/auth/login')
    }
    req.headers['x-token'] = token;
    next();
  });