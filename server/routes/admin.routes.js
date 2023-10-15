import { Router } from "express";
import { newTaskStatus } from "../controllers/taskStatus.controller.js";

const router = Router();

// Ruta para crear un nuevo estado de tarea
router.post("/new-task-status", newTaskStatus);

export default router;