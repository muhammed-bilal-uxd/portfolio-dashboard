const { Project, ProjectSource, ProjectChart } = require("./mongo-schema");

async function migrateSchemaVersion() {
  console.log("🔥 Migrating schema version");

  //   sync indexes at last after all index issue fixed
  // await ProjectSource.syncIndexes();

  // indexing
  // const indexes = await ProjectChart.collection.getIndexes();
  // console.log("indexes", indexes);

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

  // const duplicates = await ProjectChart.aggregate([
  //   {
  //     $sort: { createdAt: 1 }, // oldest first (kept clean)
  //   },
  //   {
  //     $group: {
  //       _id: "$configName",
  //       docs: { $push: "$_id" },
  //       count: { $sum: 1 },
  //     },
  //   },
  //   {
  //     $match: {
  //       _id: { $ne: null },
  //       count: { $gt: 1 },
  //     },
  //   },
  // ]);

  // for (const item of duplicates) {
  //   const baseName = item._id;

  //   for (let i = 0; i < item.docs.length; i++) {
  //     const docId = item.docs[i];

  //     // first one keep original
  //     if (i === 0) continue;

  //     const newName = `${baseName}-${i}`;

  //     await ProjectChart.updateOne(
  //       { _id: docId },
  //       { $set: { configName: newName } },
  //     );
  //   }
  // }

  // ProjectChart.deleteMany({})
  //   .then(() => {
  //     console.log("✅ Schema version updated");
  //   })
  //   .catch((err) => {
  //     console.log("❌ Schema version update failed:", err);
  //   });
  // Project
  // ProjectSource.deleteMany({});
  // ProjectChart.deleteMany({});

  // await ProjectChart.updateMany(
  //   {},
  //   {
  //     $unset: {
  //       "data.configName": "",
  //     },
  //   },
  // );
}

module.exports = {
  migrateSchemaVersion,
};
