import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.DB_URL;

export const dbConnection = async() => {

  try {
    await mongoose.connect(url);
    console.log('\x1b[33m%s\x1b[0m','Conexíon a MongoDB realizada con éxito!');
  } catch (error) {
    console.log('\x1b[31s%s\x1b[0m', error)
    throw new Error('Error al iniciar la base de datos')
  }
};