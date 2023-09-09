import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crea una instancia de un enrutador de Express
const router = express.Router();

// Ruta para cargar la página de inicio (index.html)
router.get('/', (req, res) => {
  // Envía el archivo index.html ubicado en /client/public
  const indexPath = path.join(__dirname, '..', '..', 'client', 'public', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error al enviar el archivo:', err);
      res.status(500).send('Error al cargar la página de inicio');
    }
  });
});

router.get('/tareas', (req, res) => {
  // Lógica para la ruta '/tareas'
  res.send('Aquí puedes ver tus tareas');
});

router.post('/tareas', (req, res) => {
  // Lógica para agregar una nueva tarea (POST)
  // Accede a los datos de la solicitud utilizando req.body
  const nuevaTarea = req.body;
  // Realiza acciones para agregar la tarea a la base de datos, etc.
  res.send('Tarea agregada con éxito');
});

// Agrega más rutas y controladores según sea necesario

// Exporta el enrutador para su uso en app.js u otros archivos
export default router;
