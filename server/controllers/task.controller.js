import {Task, TaskQuadrant, TaskStatus} from '../models/index.js';

// Método para obtener todas las tareas de un usuario
const getUserTasks = async (req, res) => {
    try {
        const tasks = await getUserTasks(req.params.userId);
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
  
      // Función para obtener el id de importancia
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
  
      const task = new Task({
        name,
        description,
        deadline,
        quadrant: quadrantId,
        tags,
        userId,
        status: statusId,
      });
  
      // Guarda la tarea en la base de datos
      const newTask = await task.save();
  
      res.status(201).json(newTask);
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
        const task = await getTaskById(req.params.taskId);
        await deleteTask(task);
        res.status(200).json({ message: 'Task deleted successfully' });
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