import mongoose from "mongoose";

const taskImportanceSchema = new mongoose.Schema({
    value: {
        type: Number,
        integer: true,
        unique: true,
        required: true,
        min: 1,
        max: 4,
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
    action: String,
    alert: String,
    minPercentage: {
        type: Number,
        integer: true,
        min: 0,
        max: 100,
    },
    maxPercentage: {
        type: Number,
        integer: true,
        min: 0,
        max: 100,
    },
    dateActivated: {
        type: Date,
        default: Date.now,
    },
    dateDisabled: Date,
}, {
    timestamps: true,
    versionKey: false,
});

const TaskImportance = mongoose.model('TaskImportance', taskImportanceSchema);

export default TaskImportance;
