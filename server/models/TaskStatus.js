import mongoose from 'mongoose';

const taskStatusSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: String,
  dateActivated: {
    type: Date,
    default: Date.now,
  },
  dateDisabled: Date,
}, {
    timestamps: true,
    versionKey: false,
    }
);

const TaskStatus = mongoose.model('TaskStatus', taskStatusSchema);

export default TaskStatus;
