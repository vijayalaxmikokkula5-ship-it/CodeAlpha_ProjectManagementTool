const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    startDate: {
      type: Date
    },

    deadline: {
      type: Date
    },

    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started"
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);