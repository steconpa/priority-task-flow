import mongoose from 'mongoose';
import { config } from "dotenv";
config();
// Configurar la conexión a la base de datos
const mongoDBURI = `${process.env.MONGODB_URI}&socketTimeoutMS=30000`;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};
