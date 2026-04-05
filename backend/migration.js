const { ProjectSource, ProjectChart } = require("./mongo-schema");

async function migrateSchemaVersion() {
  console.log("🔥 Migrating schema version");

  //   sync indexes at last after all index issue fixed
  await ProjectSource.syncIndexes();

  // indexing
  const indexes = await ProjectChart.collection.getIndexes();
  console.log("indexes", indexes);

  // return;

  // await ProjectSource.syncIndexes();
  // await ProjectSource.updateMany(
  //   { project: { $exists: true } },
  //   { $rename: { projectId: "$project" } },
  // )
  //   .then(() => {
  //     console.log("✅ Schema version updated");
  //   })
  //   .catch((err) => {
  //     console.log("❌ Schema version update failed:", err);
  //   });

  // await ProjectChart.updateMany(
  //   {
  //     configName: { $exists: false },
  //     "data.newConfigName": { $exists: true },
  //   },
  //   [
  //     {
  //       $set: {
  //         // 1. Rename newConfigName → configName (inside data)
  //         "data.configName": {
  //           $ifNull: ["$data.configName", "$data.newConfigName"],
  //         },

  //         // 2. Set top-level configName
  //         configName: {
  //           $ifNull: ["$data.configName", "$data.newConfigName"],
  //         },
  //       },
  //     },
  //   ],

  //   {
  //     updatePipeline: true,
  //   },
  // )
  //   .then(() => {
  //     console.log("✅ Schema version updated");
  //   })
  //   .catch((err) => {
  //     console.log("❌ Schema version update failed:", err);
  //   });
}

module.exports = {
  migrateSchemaVersion,
};
