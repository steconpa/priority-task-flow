import TaskImportance from "../models/TaskImportance.js";

const newTaskImportance = async (req, res) => {
    try {
        const { value, name, description, action, alert, minPercentage, maxPercentage } = req.body;

        const existingTaskImportanceWhitValue = await TaskImportance.findOne({ value });
        
        if (existingTaskImportanceWhitValue) {
            return res.status(400).json({ error: 'Ya existe un nivel de importancia con el mismo valor' });
        }

        const taskImportance = new TaskImportance({
            value,
            name,
            description,
            action,
            alert,
            minPercentage,
            maxPercentage,
        });

        await taskImportance.save();
        return res.status(201).json({ taskImportance });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getTaskImportance = async (req, res) => {
    try {
        const taskImportance = await TaskImportance.find();
        return res.status(200).json({ taskImportance });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateTaskImportance = async (req, res) => {
    try {
        const { value, name, description, dateActivated, dateDisabled } = req.body;

        const existingTaskImportanceWhitValue = await TaskImportance.findOne({ value });
        
        if (existingTaskImportanceWhitValue) {
            return res.status(400).json({ error: 'Ya existe un nivel de importancia con el mismo valor' });
        }

        const taskImportance = new TaskImportance({
            value,
            name,
            description,
            dateActivated,
            dateDisabled,
        });

        await taskImportance.save();
        return res.status(201).json({ taskImportance });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteTaskImportance = async (req, res) => {
    try {
        const { id } = req.params;
        const taskImportance = await TaskImportance.findByIdAndDelete(id);
        return res.status(200).json({ taskImportance });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export {
    newTaskImportance,
    getTaskImportance,
    updateTaskImportance,
    deleteTaskImportance,
};