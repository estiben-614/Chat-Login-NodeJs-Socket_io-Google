import { generarJWT } from "../helpers/GenerarJWT.js"
import { googleVerify } from "../helpers/googleVerify.js"
import { userModel } from "../models/users.js"
import bcrypt from "bcrypt"

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pathAuth=path.join(__dirname,'../public/chat.html')

export const login=async(req,res)=>{
    //Recuperamos la info del body recibida por las solicitudes POST 
    const dataBody=req.body

    //TODO: LOGIN GOOGLE
    //Si en esta info viene un token_id significa que el login es con login
    if(dataBody.token_id!==undefined){
        const {token_id}=req.body
        
    
        
        //Decodificamos el token
        const data= await googleVerify(token_id)
    
        //Desestructuramos  info del token 
        const {email,name}=data
        //console.log(email,name)

        //Esta es la respuesta del servidor y que se envia al cliente
        res.status(200).send({
            msg:'Todo Ok',
            token:token_id,
            nombre:name,
            email
        })
        //TODO: Si quieremos guardar en DB el usuario autenticado con google 
        //Creamos el usuario con nuestro modelo de la DB
        // const usuario= new userModel({
        //     email:email,
        //     nombre:name
        // })
        // //Guardamos el usuario
        // usuario
        // .save()
    }


    //TODO: LOGIN MANUAL 
    //Si no viene el token_id es porque es un login manual y tiene el email y contraseña
    else{
        //recuperamos el email y la contraseña
        const {email,password}=req.body
        
        //Buscamos en la DB a un usuario que tenga ese email
        const usuarioEncontrado=await userModel.findOne({email})
        //console.log(usuarioEncontrado)
        if(usuarioEncontrado){
                //Si encuentra un usuario, verifiquemos que las contraseñas coincidan
                const passwordCompare= await bcrypt.compare(password,usuarioEncontrado.password)
               
                //Si es son iguales
                if(passwordCompare){
                    
                    //Creamos el JWT con la info del usuario
                    const token=generarJWT({
                        nombre:usuarioEncontrado.nombre,
                        email:usuarioEncontrado.email,
                        usuario:usuarioEncontrado.usuario,
                        google:usuarioEncontrado.google
                    })
                
                    //Hacemos una solicitud POST  a la ruta /chat para luego leerla en un GET
                    fetch('http://localhost:8080/chat/',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    //Se espera una cadena de texto, por eso se pasa de JSON a String
                    body:JSON.stringify(usuarioEncontrado)
                    })
                    //Recibimos la respuesta del servidor 
                    .then(response=>response.json())
                    .then(data=> console.log(data))
                    //.catch(error=>console.log(error))


                    //Almacena el token  en una cookie del navegador y luego se envia a la ruta /chat
                    res.cookie('token',token)
                    res.redirect('/chat')
                    
                    
                }

                else{
                
                    res.status(400).send({
                        
                        msg:'La contraseña es incorrecta'
                    })
                }
        }

        //Si no encuentra un usuario
        else{
            
            res.status(400).send({
                msg:'El usuario no existe '
            })
                
        }
        
        
    }
   
}