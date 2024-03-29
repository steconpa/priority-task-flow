import { Task, TaskQuadrant, TaskStatus } from '../models/index.js';

// Método para obtener todas las tareas de un usuario
const getUserTasks = async (req, res) => {
  try {
    // Obtén el id del estado por defecto
    const defaultStatus = await TaskStatus.findOne({ code: 'ORG01' });

    if (!defaultStatus) {
      return res.status(500).json({ message: "El estado por defecto no se encuentra en la base de datos." });
    }

    // Busca todas las tareas del usuario con el estado por defecto
    const tasks = await Task.find({ userId: req.userId, status: defaultStatus });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para crear una tarea para un usuario
const createUserTask = async (req, res) => {
  try {
    const {
      name,
      description,
      deadline,
      quadrant,
      tags,
    } = req.body;

    // Obtiene el id del usuario desde req.userId
    const userId = req.userId;

    // Función para obtener el status predeterminado
    const getDefaultStatus = async () => {
      const statusObj = await TaskStatus.findOne({ code: 'ORG01' });
      return statusObj ? statusObj._id : null;
    };

    const [statusId] = await Promise.all([
      getDefaultStatus(),
    ]);

    // Verificar la cantidad de tareas "ORG01" antes de crear una nueva tarea
    const orgTasksCount = await Task.countDocuments({ userId, status: statusId });

    const orgLimit = 10; // Límite de tareas pendientes sin iniciar

    if (orgTasksCount >= orgLimit) {
      return res.status(400).json({ message: "Has alcanzado el límite de tareas pendientes por iniciar." });
    }

    //limpia los hashtags de la descripción
    const cleanedDescription = description.replace(/#[a-zA-Z0-9]+/g, '').trim();

    const task = new Task({
      name,
      description: cleanedDescription,
      deadline,
      quadrant,
      tags,
      userId,
      status: statusId,
    });

    // Guarda la tarea en la base de datos
    const newTask = await task.save();

    res.status(201).json({
      message: "Tarea creada satisfactoriamente",
      task: newTask
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Función para obtener una tarea por su ID
const getTaskById = async (taskId) => {
  try {
    // Busca la tarea en la base de datos por su ID
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error('La tarea no fue encontrada');
    }

    return task;
  } catch (error) {
    throw new Error(error.message);
  }
};

//Función para actulizar la fecha limite de una tarea
const updateUserTaskDeadline = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const newDeadline = req.body.deadline;

    const task = await Task.findOne({ _id: taskId, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Actualiza la fecha límite de la tarea
    task.deadline = newDeadline;

    // Guarda la tarea actualizada en la base de datos
    await task.save();

    res.status(200).json('Fecha actulizada satisfactoriamente');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para actualizar una tarea de un usuario
const updateUserTask = async (req, res) => {
  try {
    const task = await getTaskById(req.params.taskId);
    task.title = req.body.title;
    task.description = req.body.description;
    task.priority = req.body.priority;
    await updateTask(task);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para eliminar una tarea de un usuario
const deleteUserTask = async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.taskId });
    res.status(200).json({ message: 'Tarea eliminada satisfactorimante' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getUserTasks,
  createUserTask,
  updateUserTaskDeadline,
  updateUserTask,
  deleteUserTask,
};