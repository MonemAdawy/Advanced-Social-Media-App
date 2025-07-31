import connectDB from "./DB/connection.js"
import User from "./DB/models/user.model.js";
import Post from "./DB/models/post.model.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import postRouter from "./modules/post/post.controller.js";
import glopalErrorHandler from "./utils/errorHandling/globalErrorHandler.js";
import notFoundHandler from "./utils/errorHandling/notFound.js";

const bootstrap = async (app, express) => {
    await connectDB();

    app.use(express.json());

    app.use("/uploads", express.static("uploads"));

    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/post", postRouter);

    app.all("*", notFoundHandler)

    app.use(glopalErrorHandler);
}


export default bootstrap;