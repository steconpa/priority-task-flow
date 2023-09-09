// Importa los módulos necesarios
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './db.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Importa las rutas
import indexRoutes from './routes/index.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configura las variables de entorno desde el archivo .env
dotenv.config();

// Crea una instancia de Express
const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Middleware para analizar JSON en las solicitudes
app.use(express.json());

// Llama a la función de conexión a la base de datos desde db.js
connectDB();

// Rutas de la API
app.use('/', indexRoutes);

// Middleware de manejo de errores para rutas no encontradas (404)
app.use((req, res, next) => {
    const indexPath = path.join(__dirname, '..', 'client', 'public', '404.html');
    res.status(404).sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error al enviar el archivo:', err);
            res.status(500).send('Error al cargar la página 404');
        }
    });
  });

// Puerto en el que se ejecutará el servidor
const port = process.env.PORT || 3000;

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
