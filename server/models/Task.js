import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    deadline: Date,
    quadrant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TaskQuadrant",
        default: 1,
    },
    tags: [String],
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TaskStatus",
        default: "ORG01",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dateCompleted: Date,
    }, {
    timestamps: true,
    versionKey: false,
    });

const Task = mongoose.model("Task", taskSchema);

export default Task;
