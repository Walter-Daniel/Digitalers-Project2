import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import hbs from 'express-handlebars';

import userRoute from './routes/user.routes.js';
import authRoute from './routes/auth.routes.js';
import doctorRoute from './routes/doctor.routes.js';

import { dbConnection } from './config/dbConnection.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Crear servidor
const app = express();
const port = process.env.PORT || 8080;

//Settings
app.set('views', path.join(__dirname + 'views'));

//Conexión de la basde de datos
dbConnection();

//Lectura y parseo del body
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Static files
app.use(express.static(path.join(__dirname + 'public')));
app.engine('.hbs', hbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}))
app.set('view engine', '.hbs');

//Routing
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/doctor', doctorRoute);

//Escuchar peticiones
app.listen(port, ()=>{
    console.log('\x1b[35m%s\x1b[0m',`El servidor esta funcionado en el puerto: ${port}`)
});