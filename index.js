import express from 'express';

//Crear la app
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Definir el puerto y escuchar
const port= 3000;
app.listen(port, ()=>{
    console.log('\x1b[35m%s\x1b[0m',`El servidor esta funcionado en el puerto: ${port}`)
})