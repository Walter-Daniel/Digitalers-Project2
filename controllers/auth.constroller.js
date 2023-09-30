// import { UserModel } from '../model/user.schema';  <-- Se agrega al instalar moongose
import { MongoClient } from 'mongodb';
import {config} from 'dotenv';
config();

export const register = async(req, res) => {

    const { firstname, lastname, email, password } = req.body;

    const url = process.env.DB_URL;
    const client = new MongoClient(url);
    async function run() {
        try {
            const database = client.db("db_doctors");
            const users = database.collection("users");
            
            const doc = {
                firstname,
                lastname,
                email,
                password
            };

            const filter = { email };
            const resp = await users.findOne(filter);
            if( resp ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya se encuentra registrado'
                });
            }
            const result = await users.insertOne(doc);
            res.status(201).json({
                ok: true,
                msg: 'Usuario creado con éxito',
                email,
                result
            });
            await client.close();

        }catch(err) {
            res.status(500).json({
                ok: false,
                msg: 'Error al crear un nuevo usuario',
                err
            });
        }
    }
    run();
}
