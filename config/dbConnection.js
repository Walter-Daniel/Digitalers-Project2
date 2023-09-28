import { MongoClient, ServerApiVersion} from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.DB_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export async function dbConnection() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
        '\x1b[33m%s\x1b[0m','Conexíon a MongoDB realizada con éxito!'
    );
  } catch (error) {
    console.log('\x1b[31s%s\x1b[0m', error)
  }
  finally {
    await client.close();
  }
}