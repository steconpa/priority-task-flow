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

const getSimplifiedTaskQuadrants = async (req, res) => {
    try {
        const taskQuadrants = await TaskQuadrant.find();
        const simplifiedData = taskQuadrants.map(({ _id, value, name }) => ({ _id, value, name }));
        return res.status(200).json(simplifiedData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export {
    newTaskQuadrant,
    getSimplifiedTaskQuadrants,
};