// import { UserModel } from '../model/user.schema';  <-- Se agrega al instalar moongose
import {config} from 'dotenv';
config();

export const register = async(req, res) => {

    const { firstname, lastname, email, password } = req.body;

    MongoClient.connect(Mongo_Url_Local, async (err, db) =>{ // use miwebeit

        //si hay un error lanzamos el error
        if(err){
            return res.status(500).json({
                ok: false,
                msg: 'Error al conectarse a la base de datos',
                err
            });
            
        }
        //configurar la database a la que nos conectamos
        const miwebeit = db.db('db_doctors');
    
        //seleccionamos una colección
        const collectionName = 'user'
    
        //creamos un objeto con los datos a insertar
        let setToCollection = {
            firstname,
            lastname,
            email,
            password
        }
        const filter = { email };
        const res = await miwebeit.colection.findOne(filter);
        if( res ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya se encuentra registrado'
            });
        }
    
        //Create: insertamos un dato en la colección
    
        await miwebeit.collection(collectionName).insertOne(setToCollection, (err, res) =>{
    
            if(err) {
                res.status(500).json({
                    ok: false,
                    msg: 'Error al crear un nuevo usuario',
                    err
                });
            }
            
            //si no hay error mostramos un mensaje de creación exitosa
            res.status(201).json({
                ok: true,
                msg: 'Usuario creado con éxito',
            });
        
            //cerrar la conexión a la base de datos
            db.close();
    
        });
    
    });

      
    // try {

    //     let emailExist = await User.findOne({ email });

    //     if( emailExist ) {
    //         return res.status(400).json({
    //             ok: false,
    //             msg: 'Ya existe un usuario con ese correo'
    //         })
    //     }

    //     const newUser = new ( req.body );
    //     const salt = bcrypt.genSaltSync();
    //     newUser.password = bcrypt.hashSync( password, salt );
    //     await newUser.save();

    //     const token = await generateJWT( newUser.id, newUser.name, newUser.surname  )

    //     res.status(201).json({
    //         ok: true,
    //         msg: 'Usuario creado con éxito',
    //         id: newUser.id,
    //         name: newUser.name,
    //         surname: newUser.surname,
    //         token
    //     });

        

    // } catch (error) {
       
    // }

    // try {
    //     await client.connect();
    
    //     const database = client.db(process.env.DB_UR); // Reemplaza con el nombre de tu base de datos
    //     const colection = database.collection("user"); // Reemplaza con el nombre de tu colección
    
    //     const filter = { email }; // Reemplaza con el criterio de búsqueda adecuado
    
    //     const res = await colection.findOne(filter);
    
    //     if( res ) {
    //         return res.status(400).json({
    //             ok: false,
    //             msg: 'El correo ya se encuentra registrado'
    //         });
    //     }

    //   } catch(error){
    //         res.status(500).json({
    //             ok: false,
    //             msg: 'Error al crear un nuevo usuario'
    //         });
    //   } finally {
    //     await client.close();
    //   }


}