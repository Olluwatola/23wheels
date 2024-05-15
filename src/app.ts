import express from "express";
import authRouter from "./authentication/routes";
import errorController from "./errorController";
import routeNotFoundController from "./routeNotFoundController";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1/auth", authRouter);
app.all("*", routeNotFoundController.notFound);
app.use(errorController);

export default app;
