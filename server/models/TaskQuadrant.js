import mongoose from "mongoose";

const taskQuadrantSchema = new mongoose.Schema({
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
    description: {
        type: String,
        default: null,
    },
    action: { 
        type: String,
        default: null,
    },
    alert: {
        type: String,
        default: null,
    },
    minPercentage: {
        type: Number,
        integer: true,
        min: 0,
        max: 100,
        default: 0,
    },
    maxPercentage: {
        type: Number,
        integer: true,
        min: 0,
        max: 100,
        default: 0,
    },
    dateDisabled: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true,
    versionKey: false,
});

const TaskQuadrant = mongoose.model('TaskQuadrant', taskQuadrantSchema);

export default TaskQuadrant;
