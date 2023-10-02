import express from 'express';
import dotenv from 'dotenv';
import { dbConnection } from './config/dbConnection.js';
import userRoute from './routes/user.routes.js';
import authRoute from './routes/auth.routes.js';


dotenv.config();

//Crear servidor
const app = express();
const port = process.env.PORT || 8080;


//Conexión de la basde de datos
dbConnection();

//Lectura y parseo del body
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Routing
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

//Escuchar peticiones
app.listen(port, ()=>{
    console.log('\x1b[35m%s\x1b[0m',`El servidor esta funcionado en el puerto: ${port}`)
});