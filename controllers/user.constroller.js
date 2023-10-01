import bcrypt from 'bcryptjs';
import {config} from 'dotenv';
import User from '../model/user.schema.js';
config();

export const register = async(req, res) => {

    const { firstname, lastname, email, password, role } = req.body;

    try {

        const user = new User({firstname, lastname, email, password, role });
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        res.status(201).json({
            ok: true,
            msg: 'Usuario creado con éxito',
            user
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error al crear un nuevo usuario',
            error: error.message
        });

    }

    // async function run() {
    //     try {
    //         const database = client.db("db_doctors");
    //         const users = database.collection("users");
            
    //         const doc = {
    //             firstname,
    //             lastname,
    //             email,
    //             password,
    //             rol
    //         };

    //         const filter = { email };
    //         const resp = await users.findOne(filter);
    //         if( resp ) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 msg: 'El correo ya se encuentra registrado'
    //             });
    //         }
    //         const result = await users.insertOne(doc);
    //         res.status(201).json({
    //             ok: true,
    //             msg: 'Usuario creado con éxito',
    //             email,
    //             result
    //         });
    //         await client.close();

    //     }catch(err) {
    //         res.status(500).json({
    //             ok: false,
    //             msg: 'Error al crear un nuevo usuario',
    //             err
    //         });
    //     }
    // }
    // run();
};

//SI EL ROL ES ADMIN => REDIRECCIONAR A LA PAG DE ADMINISTARCIÓN
//SI EL ROL ES DOCTOR => REDIRECCIONAR A LA PAGINA DE CITAS Y CONSULTAS
//SI EL ROL ES USER => REDIRECCIONAR AL INICIO + BOX DE BIENVENIDA

export const login = async(req, res) => {

    const { email, password } = req.body;

    try {
        const database = client.db("db_doctors");
        const users = database.collection("users");


        const filter = { email };
        const resp = await users.findOne(filter);

        if( !resp || resp.password !== password) {
            return res.status(500).json({
                ok: false,
                msg: 'Las credenciales no son correctas'
            });
        }

        res.status(201).json({
            ok: true,
            msg: 'Inicio de sesión exitoso',
            user:{
                name: resp.firstname,
                lastname: resp.lastname,
                id: resp._id
            }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al iniciar sesión'
        });
    };   
};

export const getUsers = async(req, res) => {
    try {
      await client.connect();
  
      const database = client.db("db_doctors");
      const collection = database.collection("users");
      const query = {};

      const users = await collection.find(query).toArray();
      
      if(users.length === 0){
        return res.status(404).send({
            ok: true,
            message: 'No se encontró ningun usuario'
        });
      }
      
      return res.status(200).send({
        ok: true,
        message: 'Usuarios obtenidos correctamente',
        users
    })
    
    } catch(error){
        if(error) {
            return res.status(500).send({
                ok: false,
                message: 'Error al obtener usuario',
                error
            })
        }
    }finally {
      await client.close();
    }
  };

  export const updateUser = async(req, res) => {

    const data = req.body;
    const userID = req.params.id;

    try {

        await client.connect();
        const database = client.db("db_doctors");
        const collection = database.collection("users");
        const filter = { _id: new ObjectId(userID)};
    
        const updateDocument = {
            $set: data
        };

        const result = await collection.updateOne(filter, updateDocument);
        if (result.modifiedCount === 1) {
            return res.status(200).send({
                ok: true,
                message: 'Usuario actualizado con éxito',
              });
        };

    } catch (error) {

        return res.status(500).send({
            ok: false,
            message: 'Error al intentar actualizar el usuario',
            error
        });

    }finally{
        await client.close();
    }
  };

  export const deleteUser = async(req, res) => {
        const userID = req.params.id;
        try {
            await client.connect();
            const database = client.db("db_doctors");
            const collection = database.collection("users");
            const filter = { _id: new ObjectId(userID)};
    
            const result = await collection.deleteOne(filter);
            console.log(result);
            if (result.deletedCount === 1) {
                return res.status(200).send({
                    ok: true,
                    message: 'Usuario eliminado con éxito',
                  });
            }else {
                return res.status(500).send({
                    ok: false,
                    message: 'No se encontro ningún usuario con el id indicado',
                });
            }
    
        } catch (error) {
    
            return res.status(500).send({
                ok: false,
                message: 'Error al intentar eliminar el usuario',
                error
            });
    
        }finally{
            await client.close();
        }
  };