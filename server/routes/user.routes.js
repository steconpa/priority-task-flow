import { Router } from 'express';
import { registerUser } from '../controllers/auth.controller.js';
import { loginUser } from '../controllers/login.controller.js';

// Crea una instancia del enrutador de Express
const router = Router();

// Ruta para el registro de usuarios
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

export default router;