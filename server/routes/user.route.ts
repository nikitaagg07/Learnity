
// ROUTES: routes are the definitions of the endpoints (URIs:Uniform Resource Identifier is a system for identifying resources such as webpage,image etc) 

// while URL(Uniform Resource Locator) is a type of URI that specifies a resources location

//API Endpoints: it is a specific URL where requests are sent to interact with the API

import { Express } from "express";
import express from "express";
import { registrationUser } from "../controllers/user.controller";

const userRouter=express.Router();

userRouter.post('/registration',registrationUser);

export default userRouter;