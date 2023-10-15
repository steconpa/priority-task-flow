import TaskStatus from '../models/TaskStatus.js';

// Función para crear un nuevo estado de tarea
const newTaskStatus = async (req, res) => {
    try {
      // Desestructura los campos del cuerpo de la solicitud
      const { code, name, description, dateActivated, dateDisabled } = req.body;
  
      // Comprueba si ya existe un estado de tarea con el mismo código (code)
      const existingTaskStatusWithCode = await TaskStatus.findOne({ code });
  
      // Comprueba si ya existe un estado de tarea con el mismo nombre (name)
      const existingTaskStatusWithName = await TaskStatus.findOne({ name });
  
      // Si ya existe un estado de tarea con el mismo código o nombre, responde con un error
      if (existingTaskStatusWithCode) {
        return res.status(400).json({ error: 'Ya existe un estado de tarea con el mismo código' });
      }
  
      if (existingTaskStatusWithName) {
        return res.status(400).json({ error: 'Ya existe un estado de tarea con el mismo nombre' });
      }
  
      // Si no existen estados de tarea con los mismos valores, crea uno nuevo y guárdalo
      const taskStatus = new TaskStatus({
        code,
        name,
        description,
        dateActivated,
        dateDisabled,
      });
  
      // Guarda el nuevo estado de tarea en la base de datos
      await taskStatus.save();
  
      // Responde con el estado de tarea creado y un código de estado 201 (Created)
      return res.status(201).json({
        taskStatus,
      });
    } catch (error) {
      // Maneja errores y responde con un código de estado 500 (Internal Server Error)
      return res.status(500).json({ error: error.message });
    }
  };  

// Función para obtener todos los estados de tarea
const getTaskStatus = async (req, res) => {
  try {
    // Consultar y obtener todos los estados de tarea de la base de datos
    const taskStatus = await TaskStatus.find();

    // Responder con la lista de estados de tarea y un código de estado 200 (OK)
    return res.status(200).json({ taskStatus });
  } catch (error) {
    // Manejar errores y responder con un código de estado 500 (Internal Server Error)
    return res.status(500).json({ error: error.message });
  }
};

// Función para actualizar un estado de tarea existente
const updateTaskStatus = async (req, res) => {
  try {
    // Obtener el ID del estado de tarea a actualizar desde los parámetros de la URL
    const { id } = req.params;

    // Obtener los datos actualizados desde el cuerpo de la solicitud (req.body)
    const updatedData = req.body;

    // Buscar y actualizar el estado de tarea en la base de datos por su ID
    const taskStatus = await TaskStatus.findByIdAndUpdate(id, updatedData, { new: true });

    // Si el estado de tarea no se encuentra, responder con un código de estado 404 (Not Found)
    if (!taskStatus) {
      return res.status(404).json({ error: 'Estado de tarea no encontrado' });
    }

    // Responder con el estado de tarea actualizado y un código de estado 200 (OK)
    return res.status(200).json({ taskStatus });
  } catch (error) {
    // Manejar errores y responder con un código de estado 500 (Internal Server Error)
    return res.status(500).json({ error: error.message });
  }
};

// Función para eliminar un estado de tarea
const deleteTaskStatus = async (req, res) => {
  try {
    // Obtener el ID del estado de tarea a eliminar desde los parámetros de la URL
    const { id } = req.params;

    // Buscar y eliminar el estado de tarea en la base de datos por su ID
    const taskStatus = await TaskStatus.findByIdAndRemove(id);

    // Si el estado de tarea no se encuentra, responder con un código de estado 404 (Not Found)
    if (!taskStatus) {
      return res.status(404).json({ error: 'Estado de tarea no encontrado' });
    }

    // Responder con un código de estado 204 (No Content) para indicar que la solicitud se ha completado con éxito
    return res.status(204).json();
  } catch (error) {
    // Manejar errores y responder con un código de estado 500 (Internal Server Error)
    return res.status(500).json({ error: error.message });
  }
};

// Exportar las funciones del controlador
export {
  newTaskStatus,
  getTaskStatus,
  updateTaskStatus,
  deleteTaskStatus,
};

