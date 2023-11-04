import express from 'express';
import dotenv from 'dotenv';
import exphbs from 'express-handlebars';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import fileUpload from 'express-fileupload';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import userRoute from './routes/user.routes.js';
import authRoute from './routes/auth.routes.js';
import doctorRoute from './routes/doctor.routes.js';
import indexRoute from './routes/index.routes.js';
import imagesRoute from './routes/images.routes.js';
import appointmentRoute from './routes/appointment.routes.js';

import { showAlerts } from './helpers/alerts.js'
import { dbConnection } from './config/dbConnection.js';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

process.env.TZ = 'America/Argentina/Buenos_Aires';


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
app.use(cookieParser());


//config view engine
const hbs = exphbs.create({
   
    helpers: { 

      defaultLayout: 'main',
      layoutsDir: join(app.get('views'), 'layouts'),
      partialsDir: join(app.get('views'), 'partials'),
      showAlerts,
    },
    extname: '.hbs',
  });
  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');


//Create helper handlebars
hbs.handlebars.registerHelper('isEqual', (a, b, opts) => {
    return a == b ? opts.fn(this) : opts.inverse(this);
});

hbs.handlebars.registerHelper('customEach', function (array, variable, options) {
  let result = '';
  for (let i = 0; i < array.length; i++) {
    const data = Object.assign({}, array[i], { variable });
    result += options.fn(data);
  }
  return result;
});

hbs.handlebars.registerHelper('ifOr', function () {
  const args = Array.from(arguments);
  const options = args.pop();

  for (let i = 0; i < args.length; i++) {
    if (args[i] || args[i] === true) {
      return options.fn(this);
    }
  }

  return options.inverse(this);
});

// Configura express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: true,
}));

// Configura connect-flash
app.use(flash());

//Crear middleware
app.use((req, res, next) => {
  res.locals.messages = req.flash(); 
  res.locals.data = req.flash('data');
  next();
});

app.use(methodOverride('_method'));

// Image upload
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

//Routing

app.use('/', indexRoute);
app.use('/appointment', appointmentRoute);
app.use('/auth', authRoute);
app.use('/doctor', doctorRoute);
app.use('/images', imagesRoute);
app.use('/user', userRoute);


//Static files
app.use(express.static(join(__dirname , 'public')));

app.use((req, res, next) => {
  return res.status(404).render("404");
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", {
    error,
  });
});

//Escuchar peticiones
app.listen(port, ()=>{
    console.log('\x1b[35m%s\x1b[0m',`El servidor esta funcionado en el puerto: ${port}`)
});