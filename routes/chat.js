import express from "express"

export const AuthChat=express.Router()
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let data=null
AuthChat.post('/',(req,res)=>{
    //En el body viene la data del fecth aniado con la info de la solicitud POST de Login con el usuarioEncontrado
    data=req.body
    
})

AuthChat.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/chat.html'))
})

//Como en la request ya viene la info del usuarioEncontrado en la data, lo enviamos como respuesta para luego mandarlo al cliente con un fecth GET
AuthChat.get('/usuario',(req,res)=>{
    //console.log(data)
    res.send(data)
})



