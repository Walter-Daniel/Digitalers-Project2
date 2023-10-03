import express from 'express';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';

import userRoute from './routes/user.routes.js';
import authRoute from './routes/auth.routes.js';
import doctorRoute from './routes/doctor.routes.js';
import indexRoute from './routes/index.routes.js'

import { dbConnection } from './config/dbConnection.js';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

//Crear servidor
const app = express();
const port = process.env.PORT || 8080;

//Settings
app.set('views', join(__dirname, 'views'));

//Conexión de la basde de datos
dbConnection();

//Lectura y parseo del body
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//config view engine
const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs',
  });
  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');

//Routing
app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/doctor', doctorRoute);

//Static files
app.use(express.static(join(__dirname , 'public')));

//Escuchar peticiones
app.listen(port, ()=>{
    console.log('\x1b[35m%s\x1b[0m',`El servidor esta funcionado en el puerto: ${port}`)
});