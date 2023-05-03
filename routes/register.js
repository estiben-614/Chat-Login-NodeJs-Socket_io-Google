import express from "express"
import { crearUsuario } from "../controllers/registrarse.js"
import { userExiste } from "../middlewares/db-validations.js"
export const RegisterRouter=express.Router()

RegisterRouter.post('/',userExiste,crearUsuario)  