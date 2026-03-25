const express = require("express");
const router = express.Router();
const { Project } = require("./mongodb");

// get all
router.get("/", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// get one
router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.json(project);
});

// create
router.post("/", async (req, res) => {
  const payload = req.body;
  console.log("payload", payload);

  const project = new Project(payload);
  const saved = await project.save();

  res.json(saved);
});

// update
router.put("/:id", async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// delete
router.delete("/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
