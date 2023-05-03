import express from "express";
import {  RegisterRouter } from "../routes/register.js";
import bodyParser from "body-parser"
import { dbConeccion } from "../helpers/db.js";
import { AuthRouter } from "../routes/auth.js";
import cookieParser from "cookie-parser";
import { AuthChat } from "../routes/chat.js";
import { Server } from "socket.io";
import {createServer} from "http"
import { socketControllers } from "../controllers/socketcontrollers.js";



export class Servidor{
    constructor(){
        //Cada vez que se crea una clase server se ejecutan estas variables
        this.app= express()
        
        this.port = process.env.PORT

        //Sockets
        this.server=createServer(this.app)
        this.io=new Server(this.server)

        //Conectar  ala base de datos
        this.conectarDB()

        //rutas
        this.paths={
            auth:'/auth',
            register:'/register',
            chat:'/chat'
        }
       
        //Middlewares : Funciones que se van a levantar cuando se ejecute el servidor 
        this.middelwares()
        
        //Rutas de aplicación
        this.routes()

        //Inicialización Sockets.io
        this.sockets()
    }

    //Conecta la BD de mongo 
    async conectarDB(){
        await dbConeccion()
    }
    middelwares(){
        

        //Lectura y parseo del body, recibe la info de los post,put, etc
        this.app.use(express.json())

            //Recibe solicitudes del form action 
            this.app.use(bodyParser.urlencoded({ extended: true }));

        //Directorio publico
        this.app.use(express.static('public'))

        //Cookie Parser
        this.app.use(cookieParser())

        


       
    }

    routes(){
        this.app.use(this.paths.register,RegisterRouter)
        this.app.use(this.paths.auth,AuthRouter)
        this.app.use(this.paths.chat,AuthChat)

    }

    sockets(){
        this.io.on('connection', (socket)=>socketControllers(socket,this.io));
    }
    listen(){
        this.server.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
          })
    }
}