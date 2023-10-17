import { Router } from 'express';
import { registerUser } from '../controllers/auth.controller.js';
import { loginUser } from '../controllers/login.controller.js';
import { verifyToken } from '../middleware/authJwt.js'
import { createUserTask, getUserTasks } from '../controllers/task.controller.js';

// Crea una instancia del enrutador de Express
const router = Router();

// Ruta para el registro de usuarios
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para la crear una nueva tarea
router.post('/add-task', verifyToken, createUserTask);

//Ruta para el tablero del usuario
router.get('/dashboard', verifyToken, getUserTasks);

export default router;