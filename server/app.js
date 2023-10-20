// Importa los módulos necesarios
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from "dotenv";

import { connectDB } from './db.js';

import router from './routes/index.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configura las variables de entorno desde el archivo .env
config();

// Crea una instancia de Express
const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Middleware para analizar JSON en las solicitudes
app.use(express.json());

// Configurar directorio público
app.use(express.static(path.join(__dirname, '../client/public')));

// Llama a la función de conexión a la base de datos desde db.js
connectDB();

// Rutas de la API
app.use('/', router);

// Middleware de manejo de errores para rutas no encontradas (404)
app.use((req, res, next) => {
    const indexPath = path.join(__dirname, '../client/public', '404.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error al enviar el archivo:', err);
            res.status(404).send('Error al cargar la página 404');
        }
    });
  });

// Puerto en el que se ejecutará el servidor
const port = process.env.PORT || 3000;

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
