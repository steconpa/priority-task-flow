// Importa los módulos necesarios
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Configura las variables de entorno desde el archivo .env
dotenv.config();

// Crea una instancia de Express
const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Middleware para analizar JSON en las solicitudes
app.use(express.json());
// Conexión a la base de datos MongoDB utilizando Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

// Rutas de la API
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Puerto en el que se ejecutará el servidor
const port = process.env.PORT || 3000;

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
