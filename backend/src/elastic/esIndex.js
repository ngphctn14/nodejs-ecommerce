import { esClient } from "./esClient.js";

export async function createProductsIndex() {
  const indexExists = await esClient.indices.exists({ index: "products" });

  if (!indexExists) {
    await esClient.indices.create({
      index: "products",
      body: {
        mappings: {
          properties: {
            name: { type: "text" },
            description: { type: "text" },
          }
        }
      }
    });
    console.log("Created products index in Elasticsearch");
  }
}
