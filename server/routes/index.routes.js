import { Router } from 'express';
import userRoutes from './user.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

// Rutas relacionadas el manejo de los usuarios
router.use ('/user', userRoutes);

//Rutas relacionadas a la gestion del admisnitrador
router.use('/admin', adminRoutes);

export default router;
