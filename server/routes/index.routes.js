import { Router } from 'express';
import userRoutes from './user.routes.js';

const router = Router();

// Ruta para cargar la página de inicio (index.html)
router.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', '..', 'client', 'public', 'index.html');
  res.sendFile(indexPath);
});

// Rutas relacionadas el manejo de los usuarios
router.use ('/user', userRoutes);

export default router;
