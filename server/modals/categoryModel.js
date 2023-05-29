import mongoose from "mongoose"
const categorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});
const Category = mongoose.model("Category", categorySchema);
export default Category