const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    schemaVersion: { type: String, default: "v1" },
  },
  { timestamps: true },
  // schemaVersion: { type: String, default: "v1" },
  // '_needsMigration': { type: Boolean, default: false },
  // '_legacy': { type: Boolean, default: false },
);

const projectDetailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    schemaVersion: { type: String, default: "v1" },
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
      unique: false,
      trim: true,
    },
    schemaVersion: { type: String, default: "v1" },
  },
  { timestamps: true },
);

projectSourceSchema.index({ projectId: 1, sourceLink: 1 }, { unique: true });

module.exports = {
  Project: mongoose.model("Project", projectSchema),
  ProjectDetail: mongoose.model("ProjectDetail", projectDetailSchema),
  ProjectSource: mongoose.model("ProjectSource", projectSourceSchema),
};
