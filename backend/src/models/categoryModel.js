import mongoose from "mongoose";
import slugifyVN from "../config/slugify.js";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugifyVN(this.name);
  }
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugifyVN(update.name);
    this.setUpdate(update);
  }
  next();
});

categorySchema.pre("insertMany", function (next, docs) {
  for (const doc of docs) {
    if (!doc.slug && doc.name) {
      doc.slug = slugifyVN(doc.name);
    }
  }
  next();
});

export default mongoose.model("Category", categorySchema);
