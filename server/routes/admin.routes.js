import { Router } from "express";
import { newTaskStatus } from "../controllers/taskStatus.controller.js";
import { newTaskImportance } from "../controllers/taskImportance.controller.js";

const router = Router();

// Ruta para crear un nuevo estado de tarea
router.post("/new-task-status", newTaskStatus);

// Ruta para crear un nuevo nivel de importancia
router.post("/new-task-importance", newTaskImportance);

export default router;