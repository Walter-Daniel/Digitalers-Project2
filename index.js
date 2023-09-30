import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnection } from './config/dbConnection.js';
import authRoute from './routes/auth.routes.js';


dotenv.config();

//Crear servidor
const app = express();

//Conexión de la basde de datos
dbConnection();

//CORS
app.use(cors)

//Routing
app.use('/api/auth', authRoute);

//Lectura y parseo del body
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Escuchar peticiones
app.listen(process.env.PORT, ()=>{
    console.log('\x1b[35m%s\x1b[0m',`El servidor esta funcionado en el puerto: ${process.env.PORT}`)
});