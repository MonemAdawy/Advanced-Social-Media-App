import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose
        .connect(process.env.DB)
        .then(() => console.log("DB connected successfully!"))
        .catch((error) => console.log(`DB failed to connect ${error.message}`))
}

export default connectDB;