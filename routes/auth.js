import express from "express"
import { login } from "../controllers/login.js"

export const AuthRouter=express.Router()

AuthRouter.post('/',login)


