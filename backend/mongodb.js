const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);

const projectDetailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);

const projectSourceSchema = new mongoose.Schema(
  {
    // projectId: { type: String, required: true },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    sourceLink: { 
      type: String, 
      required: true,
      unique: true, // 🔥 THIS is what you want
      trim: true,
     },
  },
  { timestamps: true },
);

module.exports = {
  Project: mongoose.model("Project", projectSchema),
  ProjectDetail: mongoose.model("ProjectDetail", projectDetailSchema),
  ProjectSource: mongoose.model("ProjectSource", projectSourceSchema),
};
