//TODO: SON LOS SOCKETS DESDE EL SERVER
import { ChatMensaje } from "../models/chatMensajes.js"

const chatMensajes=new ChatMensaje()

export const socketControllers=(socket,io) => { 
    //Recibe el nombre de ../public/js/chat.js que viene 
    const nombreUsuarioConectado=socket.handshake.headers["usuario_conectado"]
    
    //Todo: Está capturando los sockets que se conectan
    //Si el usuario se encuentra conectado
    if(nombreUsuarioConectado!==undefined){
        console.log('usuario conectado : ',nombreUsuarioConectado,' ID: ',socket.id)

        //Mandamos al cliente los usuarios que se van conectando
        io.emit('usuariosQueSeVenConectando',nombreUsuarioConectado)

        //Todo: Captura desde el server la info del socket que se desconecta
        socket.on("disconnect",()=>{
            //nombreUsuarioConectado=nombre Usuario desconectado
            console.log("Usuario desconectado",nombreUsuarioConectado,' ID: ',socket.id)

            //Eliminamos al usuario de la lista de usuarios conectados
            chatMensajes.desconectarUsuario(socket.id)

            //Una vez desconectado mandamos la nueva lista de usuarios conectados
            const usuariosConectados=chatMensajes.usuariosConectados
            //console.log(usuariosConectados)
            io.emit('usuariosConectados',usuariosConectados)

            //Mandemos el nombre del user que se desconectó para mostrarlo en el chat : 
            io.emit('usuarioDesconectado',nombreUsuarioConectado)
    })
    //TODO: Codigo para recibir, enviar y mostrar el mensaje
        //Recibe los datos enviados desde el cliente con el evento datosMensaje
        socket.on('datosMensaje',(nombre,mensaje,ID)=>{
            
            //Creamos y guardamos  el mensaje como un objeto en la listaMensajes
            let mensajeUsuario= chatMensajes.enviarMensaje(ID,nombre,mensaje)
            
            //Contiene una lista de mensajes, donde cada uno es un objeto con propiedades nombreUsuario, ID, mensaje
            const listaMensajes=chatMensajes.ultimos10Mensajes
            io.emit('datosMensaje',listaMensajes)
           
        }) 

        socket.on('mensajePrivado',(nombre,mensaje,ID,IdAEnviar)=>{
            let mensajeUsuario= chatMensajes.enviarMensaje(ID,nombre,mensaje)
            //Enviamos el mensaje solo al socket con ID definido. Tambien se envia el nombre de quien envió el mensaje
            io.to(IdAEnviar).emit('mensajePrivado',mensajeUsuario,nombre)
            socket.emit('mensajePrivado',mensajeUsuario,nombre)
        })
    
    //TODO: Codigo para mostrar a los usuarios conectados
        //Recibe el nombre del usuario conectado y su socket ID
        socket.on('usuariosConectados',(nombre,ID)=>{
            //Agrega al usuario conectado en un {}
            chatMensajes.conectarUsuario(ID,nombre)

            //Obtenemos una lista con los usuarios conectados
            const usuariosConectados=chatMensajes.usuariosConectados
            
            io.emit('usuariosConectados',usuariosConectados)
        })

    //TODO: Código para identificar a los usuarios que se desconectaron y para actualizar la lista de users conectados
    socket.on('usuariosDesconectados',(nombre,ID)=>{
        console.log(nombre,ID)
    })
        
    }
    
    }