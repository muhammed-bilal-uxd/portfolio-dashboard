const express = require("express");
const router = express.Router();
const { ProjectSource } = require("./mongo-schema");
const mongoose = require("mongoose");

// get one
router.get("/:projectId", async (req, res) => {
  const projects = await ProjectSource.find();
  res.json(projects);
});

// get all
router.get("/", async (req, res) => {
  const { projectId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Invalid projectId" });
  }

  const sources = await ProjectSource.find({ projectId })
    .populate("projectId")
    .sort({ createdAt: -1 });

  res.json(sources);
});

// create
router.post("/", async (req, res) => {
  try {
    const { projectId, sourceLink } = req.body;
    // console.log("payload", payload);

    // validation
    if (!projectId || !sourceLink) {
      return res.status(400).json({
        message: "projectId and sourceLink required",
      });
    }

    const projectSource = new ProjectSource({ projectId, sourceLink });

    console.log("projectId", { projectId, sourceLink });

    const saved = await projectSource.save();
    res.status(201).json({
      message: "Saved successfully",
      data: saved,
    });
  } catch (err) {
    console.error("POST /project-source failed:", err);

    // if (err?.message.includes("duplicate")) {
    //   res.status(409).json({
    //     status: 409,
    //     message: "duplicate data found",
    //   });
    // } else {
    //   res.status(500).json({
    //     status: 500,
    //     message: err?.message || "Internal server error",
    //   });
    // }

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate source for this project",
      });
    }

    res.status(500).json({
      status: 500,
      message: err?.message || "Internal server error",
    });
  }
});

// update
router.put("/:id", async (req, res) => {
  const updated = await ProjectSource.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
  );
  res.json(updated);
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    await ProjectSource.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
