import { response } from "express";

export const tokenInHeader = ((req, res=response, next) => {
    const token = req.cookies.token;
    req.headers['x-token'] = token;
    next();
  });