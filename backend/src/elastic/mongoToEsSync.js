import { esClient } from "./esClient.js";
import Product from "../models/productModel.js";

export async function syncAllProducts() {
  const products = await Product.find({}).lean();
  if (!products.length) return;

  const bulkOps = [];

  products.forEach((p) => {
    bulkOps.push({
      index: { _index: "products", _id: p._id.toString() }
    });
    bulkOps.push({
      ...p,
      _id: undefined 
    });
  });

  const body = await esClient.bulk({ refresh: true, body: bulkOps });
  
  if (body.errors) {
    console.error("Errors in bulk indexing:", body.items);
  } else {
    console.log(`Successfully indexed ${products.length} products`);
  }
}

export function startMongoToEsSync() {
  const changeStream = Product.watch();

  changeStream.on("change", async (change) => {
    const id = change.documentKey._id.toString();

    try {
      if (change.operationType === "insert" || change.operationType === "update") {
        const doc = await Product.findById(id).lean();
        await esClient.index({ index: "products", id, document: doc });
        console.log(`[ES] Upserted product ${id}`);
      }

      if (change.operationType === "delete") {
        await esClient.delete({ index: "products", id });
        console.log(`[ES] Deleted product ${id}`);
      }
    } catch (err) {
      console.error("[ES Sync Error]", err);
    }
  });

  console.log("MongoDB change stream for products started");
}