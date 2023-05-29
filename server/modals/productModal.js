import mongoose from "mongoose";



const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            require: true,
        },
        image: {
            type: String,
            require: true,
        },
        rating: {
            type: Number,
            require: true,
            default: 0,
        },
        numReview: {
            type: Number,
            require: true,
            default: 0,
        },
        price: {
            type: Number,
            require: true,
            default: 0,
        },
        countInStock: {
            type: Number,
            require: true,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
