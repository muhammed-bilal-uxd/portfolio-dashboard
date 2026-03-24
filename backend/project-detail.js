const express = require("express");
const router = express.Router();
const ProjectDetail = require("./mongodb");

// get all
router.get("/", async (req, res) => {
  const projects = await ProjectDetail.find();
  res.json(projects);
});

// get one
router.get("/:id", async (req, res) => {
  const project = await ProjectDetail.findById(req.params.id);
  res.json(project);
});

// create
router.post("/", async (req, res) => {
  const project = new Project(req.body);
  const saved = await ProjectDetail.save();
  res.json(saved);
});

// update
router.put("/:id", async (req, res) => {
  const updated = await ProjectDetail.findByIdAndUpdate(
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
  await ProjectDetail.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
