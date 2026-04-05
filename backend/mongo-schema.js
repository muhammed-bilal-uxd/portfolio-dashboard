const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    schemaVersion: { type: String, default: "v1" },
  },
  { timestamps: true },
);

const ProjectChartSchema = new mongoose.Schema(
  {
    configName: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    schemaVersion: { type: String, default: "v1" },
  },
  { timestamps: true },
);

ProjectChartSchema.index({ configName: 1 }, { unique: true });

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
      unique: false,
      trim: true,
    },
    schemaVersion: { type: String, default: "v1" },
  },
  { timestamps: true },
);

// projectSourceSchema.index({ projectId: 1, sourceLink: 1 }, { unique: true });

module.exports = {
  Project: mongoose.model("Project", projectSchema),
  ProjectSource: mongoose.model("ProjectSource", projectSourceSchema),
  ProjectChart: mongoose.model("ProjectChart", ProjectChartSchema),
};
