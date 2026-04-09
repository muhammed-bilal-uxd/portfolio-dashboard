const { Project, ProjectSource, ProjectChart } = require("./mongo-schema");

/**
 * 🔹 1. Sync Indexes (Run manually when needed)
 */
async function syncIndexes() {
  console.log("🔧 Syncing indexes...");
  await ProjectSource.syncIndexes();
  console.log("✅ Index sync complete");
}

/**
 * 🔹 2. Rename project → projectId
 */
async function renameProjectField() {
  console.log("🔧 Renaming project → projectId...");

  await ProjectSource.updateMany(
    { project: { $exists: true } },
    { $rename: { project: "projectId" } }
  );

  console.log("✅ Rename complete");
}

/**
 * 🔹 3. Fix configName from data.newConfigName
 */
async function migrateConfigName() {
  console.log("🔧 Migrating configName...");

  await ProjectChart.updateMany(
    {
      configName: { $exists: false },
      "data.newConfigName": { $exists: true },
    },
    [
      {
        $set: {
          "data.configName": {
            $ifNull: ["$data.configName", "$data.newConfigName"],
          },
          configName: {
            $ifNull: ["$data.configName", "$data.newConfigName"],
          },
        },
      },
    ],
    { updatePipeline: true }
  );

  console.log("✅ configName migration complete");
}

/**
 * 🔹 4. Fix duplicate configNames
 */
async function fixDuplicateConfigNames() {
  console.log("🔧 Fixing duplicate configNames...");

  const duplicates = await ProjectChart.aggregate([
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$configName",
        docs: { $push: "$_id" },
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        _id: { $ne: null },
        count: { $gt: 1 },
      },
    },
  ]);

  for (const item of duplicates) {
    const baseName = item._id;

    for (let i = 0; i < item.docs.length; i++) {
      if (i === 0) continue;

      const newName = `${baseName}-${i}`;

      await ProjectChart.updateOne(
        { _id: item.docs[i] },
        { $set: { configName: newName } }
      );
    }
  }

  console.log("✅ Duplicate fix complete");
}

/**
 * 🔹 5. Remove data.configName
 */
async function removeNestedConfigName() {
  console.log("🔧 Removing data.configName...");

  await ProjectChart.updateMany(
    {},
    {
      $unset: {
        "data.configName": "",
      },
    }
  );

  console.log("✅ Nested field removed");
}

/**
 * 🔹 6. Dangerous Cleanup (Use carefully)
 */
async function deleteAllProjectCharts() {
  console.log("⚠️ Deleting all ProjectChart data...");

  await ProjectChart.deleteMany({});

  console.log("✅ All ProjectChart deleted");
}

/**
 * 🔹 MAIN CONTROLLER
 * Call only what you need
 */
async function migrateSchemaVersion() {
  console.log("🔥 Migration started");

  try {
    // 👉 Enable only what you need

    // await syncIndexes();
    // await renameProjectField();
    // await migrateConfigName();
    // await fixDuplicateConfigNames();
    // await removeNestedConfigName();
    // await deleteAllProjectCharts();

    console.log("🎯 Migration completed");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  }
}

module.exports = {
  migrateSchemaVersion,

  // expose individual methods if needed
  // syncIndexes,
  // renameProjectField,
  // migrateConfigName,
  // fixDuplicateConfigNames,
  // removeNestedConfigName,
  // deleteAllProjectCharts,
};