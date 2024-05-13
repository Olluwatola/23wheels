import express from "express";
import authRouter from './authentication/routes';
import errorController from './errorController';



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1/auth", authRouter);

app.use(errorController);



export default app;
