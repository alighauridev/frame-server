import mongoose from "mongoose";
import dotenv from "dotenv";

mongoose.set("strictQuery", true);

const connectDb = async () => {
    dotenv.config();

    try {
        const conn = await mongoose.connect(
            "mongodb+srv://ImageFramer:ImageFramer$7@imageframercluster.sn9ghxs.mongodb.net/?retryWrites=true&w=majority",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log(`MongoDB Connected ${conn.connection.host}`);
    } catch (error) {
        console.log("Error", error.message);
        process.exit(1);
    }
};

export default connectDb;
