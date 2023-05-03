import { googleVerify } from "../helpers/googleVerify.js"
import { userModel } from "../models/users.js"
import bcrypt from "bcrypt"


export const crearUsuario=async (req,res)=>{

        const {nombre,usuario,password,email}=req.body
        //console.log(usuario)
       

        //Creamos el usuario con nuestro modelo de la DB
        const usuarioBD= new userModel({
            email:email,
            nombre:nombre,
            password:password,
            google:false,
            usuario:usuario
        })

        //Encriptamos la contraseña
        const salt= await bcrypt.genSalt(10)
        const crypted= await bcrypt.hash(password,salt)

        //Guardamos la contraseña encriptada en el usuario 
        usuarioBD.password=crypted

        //Guardamos el usuario en la DB
        usuarioBD.save()

        
        res.redirect('/')
    }
    
