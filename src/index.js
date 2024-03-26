import express from "express";

import UserRouter from "./routes/users.js";
import ReviewRouter from "./routes/reviews.js";

const app = express();

// 미들웨어 등록
app.use(express.json());

// 라우터 등록
app.use("/users", UserRouter);
app.use("/reviews", ReviewRouter);

app.listen(8000);
