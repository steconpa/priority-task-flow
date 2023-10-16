import { Router } from "express";
import { newTaskStatus } from "../controllers/taskStatus.controller.js";
import { newTaskQuadrant } from "../controllers/taskQuadrant.controller.js";

const router = Router();

// Ruta para crear un nuevo estado de tarea
router.post("/new-task-status", newTaskStatus);

// Ruta para crear un nuevo nivel de importancia
router.post("/new-task-quadrant", newTaskQuadrant);

export default router;