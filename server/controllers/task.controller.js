import { Task, TaskQuadrant, TaskStatus } from '../models/index.js';

// Método para obtener todas las tareas de un usuario
const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    // Obtén los datos de quadrant y status
    const taskDataWithReferences = await Promise.all(tasks.map(async (task) => {
      const { quadrant, status, userId, ...taskData } = task._doc;
      const [quadrantData, statusData] = await Promise.all([
        TaskQuadrant.findById(quadrant),
        TaskStatus.findById(status),
      ]);
      return {
        ...taskData,
        quadrant: quadrantData,
        status: statusData,
      };
    }));

    res.status(200).json(taskDataWithReferences);
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

    // Función para obtener el id del cuadrante
    const getQuadrant = async () => {
      const quadrantObj = await TaskQuadrant.findOne({ value: quadrant });
      return quadrantObj ? quadrantObj._id : null;
    };

    // Función para obtener el status predeterminado
    const getDefaultStatus = async () => {
      const statusObj = await TaskStatus.findOne({ code: 'ORG01' });
      return statusObj ? statusObj._id : null;
    };

    const [quadrantId, statusId] = await Promise.all([
      getQuadrant(),
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
      quadrant: quadrantId,
      tags,
      userId,
      status: statusId,
    });

    // Guarda la tarea en la base de datos
    const newTask = await task.save();

    res.status(201).json({ message: "Tarea creada satisfactoriamente" });
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
  updateUserTask,
  deleteUserTask,
};