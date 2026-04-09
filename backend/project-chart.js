const express = require("express");
const router = express.Router();
const { ProjectChart } = require("./mongo-schema");

// get one
router.get("/:projectId", async (req, res) => {
  const charts = await ProjectChart.find();
  res.json(charts);
});

// get all

router.get("/", async (req, res) => {
  const { projectId } = req.query;

  // if (!mongoose.Types.ObjectId.isValid(projectId)) {
  //   return res.status(400).json({ message: "Invalid projectId" });
  // }

  const charts = await ProjectChart.find({ "data.projectId": projectId })
    // .populate("projectId")
    .sort({ createdAt: -1 });

  // const project = await ProjectChart.findById(req.params.id);
  res.json(charts);
});

// create
router.post("/", async (req, res) => {
  const { data, configName } = req.body;

  if (!data) throw new Error("data not found");

  if (!configName) throw new Error("configName not found");

  try {
    const projectChart = new ProjectChart({ data, configName });
    const saved = await projectChart.save();

    res.status(201).json({
      message: "successfully added",
      code: 201,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate chart name issue found
      return res.status(400).json({
        message: "Chart name already exist",
      });
    }

    res.status(err.code).json({
      message: err.message,
      code: err.code,
    });
  }
});

// update
router.put("/", async (req, res) => {
  const { chartId } = req.query;
  const { configName, selectListItemOne, selectListItemTwo, chartData } =
    req.body;

  const payload = {};

  if (configName) {
    payload["configName"] = configName;
  }

  if (selectListItemOne) {
    payload["data.selectListItemOne"] = selectListItemOne;
  }

  if (selectListItemTwo) {
    payload["data.selectListItemTwo"] = selectListItemTwo;
  }

  if (Array.isArray(chartData) && chartData.length > 0) {
    payload["data.chartData"] = chartData;
  }

  // 🚨 prevent empty update
  if (Object.keys(payload).length === 0) {
    throw new Error("No keys matched");
  }

  try {
    await ProjectChart.updateOne(
      { _id: chartId },
      {
        $set: {
          ...payload,
        },
      },
    );

    res.status(200).json({
      message: "chart successfully updated",
      status: 200,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate chart name issue found
      return res.status(400).json({
        message: "Chart name already exist",
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
  await ProjectChart.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
