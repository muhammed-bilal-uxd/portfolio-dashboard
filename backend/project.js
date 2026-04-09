const express = require("express");
const router = express.Router();
const { Project } = require("./mongo-schema");

// get all
router.get("/", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

// get one
router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.json(project);
});

// create
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    // console.log("payload", payload);

    const project = new Project(payload);
    const saved = await project.save();

    res.json({
      message: "Project successfully added",
      status: 201,
    });
  } catch (err) {
    console.error("POST /project failed:", err);

    if (err.code === 11000) {
      // Duplicate chart name issue found
      return res.status(400).json({
        message: "Chart name already exist",
        status: 400,
      });
    }

    res.status(err.code).json({
      message: err.message,
      code: err.code,
    });
  }
});

// update
router.put("/:id", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      message: "Project updated successfully",
      status: 200,
    });
    // res.json(updated);
  } catch (err) {
    console.error("POST /project failed:", err);

    if (err.code === 11000) {
      // Duplicate chart name issue found
      return res.status(400).json({
        message: "Chart name already exist",
        status: 400,
      });
    }

    res.status(err.code).json({
      message: err.message,
      code: err.code,
    });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
