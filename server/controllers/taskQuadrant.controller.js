import { TaskQuadrant } from "../models/index.js";

const newTaskQuadrant = async (req, res) => {
    try {
        const { value, name, description, action, alert, minPercentage, maxPercentage } = req.body;

        const existingTaskQuadrantWhitValue = await TaskQuadrant.findOne({ value });

        if (existingTaskQuadrantWhitValue) {
            return res.status(400).json({ error: 'Ya existe un cuadrante con el mismo valor' });
        }

        const taskQuadrant = new TaskQuadrant({
            value,
            name,
            description,
            action,
            alert,
            minPercentage,
            maxPercentage,
        });

        await taskQuadrant.save();
        return res.status(201).json({ taskQuadrant });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getQuadrantValueAndName = async (req, res) => {
    try {
        const taskQuadrant = await TaskQuadrant.findOne({ _id: req.params.id });
        return res.status(200).json({ value: taskQuadrant.value, name: taskQuadrant.name });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
/*
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
*/
export {
    newTaskQuadrant,
    getQuadrantValueAndName
};