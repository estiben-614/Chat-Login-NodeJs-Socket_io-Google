//TODO: Primero se ejecuta el infoUsuario, almacena el nombreUsuarioConectado, luego ejecuta el conectarSocket que ya contiene el nombreUsuarioConectado y allí hace todos sus eventos

let nombreUsuarioConectado

//Referencias HTML 
const userConectado=document.querySelector('span')
const txtSocketID=document.querySelector('#txtSocketID')
const txtMensaje=document.querySelector('#txtMensaje')
const ulUsuariosConectados=document.querySelector('#ulUsuariosConectados')
const ulMensajes=document.querySelector('#ulMensajes')
const btnSalir=document.querySelector('#btnSalir')
const btnEnviarMensaje=document.querySelector('#btnEnviarMensaje')


//Aquí va toda la parte de la logica de los sockets para mostrar en el CLIENTE,sus eventos con el servidor , modificaciones al HTML
const conectarSocket=async()=>{
  //Creamos la variable socket y mandamos el extraHeader al servidor con el nombre del usuario que se conectó
  const socket= await io({
    extraHeaders:{
      'usuario_conectado':nombreUsuarioConectado
    }
  })

  //Mensaje de bienvenida
  userConectado.innerHTML=' '+nombreUsuarioConectado+' '

  //TODO: Código para mostrar en el chat los usuarios que se conectan
  socket.on('usuariosQueSeVenConectando',nombreUserConectado=>{
    const mensajesMostrados=ulMensajes.childElementCount
    if(mensajesMostrados<10){
        ulMensajes.innerHTML+=`<li style=" color: blue"> <strong>${nombreUserConectado}</strong> ha ingresado al Chat!</li>`
    }
    else{
      const primerMensaje=ulMensajes.firstChild
        ulMensajes.removeChild(primerMensaje)
        ulMensajes.innerHTML+=`<li style=" color: blue"> <strong>${nombreUserConectado}</strong> ha ingresado al Chat!</li>`
    }
  })

  //TODO: Codigo para enviar mensaje y mostrarlo en chat
  btnEnviarMensaje.addEventListener('click',()=>{
    const mensaje=txtMensaje.value
    const IdPrivado=txtSocketID.value

    //Si no hay un ID para un mensaje privado
    if(IdPrivado==''){
      if(mensaje!=''){
        //Mandamos al servidor en socketControllers el nombre del  usuario ,mensaje, y el socket ID 
      socket.emit('datosMensaje',nombreUsuarioConectado,mensaje,socket.id)
      }
    }
    //Si si hay un ID para un mensaje privado
    else{
      socket.emit('mensajePrivado',nombreUsuarioConectado,mensaje,socket.id,IdPrivado)
    }
    
    
  })
    //TODO: Mensajes normales
    //Recibimos una lista de mensajes, donde cada uno es un objeto con propiedades nombreUsuario, ID, mensaje
    socket.on('datosMensaje',listaMensajes=>{

      //Como cada mensaje nuevo se guarda en el inicio de la lista, buscamos siempre el primer elemento
      const mensajeRecibido=listaMensajes[0]

      const mensajesMostrados=ulMensajes.childElementCount
      const audio=new Audio('./Audio/whatsapp-campana.mp3')
        audio.play()
      //Solo vamos a mostrar los primeros 10 mensajes
      if(mensajesMostrados<10){
        ulMensajes.innerHTML+=`<li> <strong>${mensajeRecibido.nombreUsuario}:</strong> ${mensajeRecibido.mensaje}</li>`

      }
      //Si hay mas de 10, eliminamos el primer mensaje y enviamos el mensaje para tener los 10
      else{
        const primerMensaje=ulMensajes.firstChild
        ulMensajes.removeChild(primerMensaje)
        ulMensajes.innerHTML+=`<li> <strong>${mensajeRecibido.nombreUsuario}:</strong> ${mensajeRecibido.mensaje}</li>`
      }
      

    })

    //TODO: Mensajes privados
    socket.on("mensajePrivado",(mensaje,nombreEnvia)=>{
      //mensaje tiene la propiedad mensaje

      const mensajesMostrados=ulMensajes.childElementCount
      if(mensajesMostrados<10){
        ulMensajes.innerHTML+=`<li style=" background-color:yellow"> <strong>${nombreEnvia}</strong> ${mensaje.mensaje}</li>`
      }
      else{
        const primerMensaje=ulMensajes.firstChild
          ulMensajes.removeChild(primerMensaje)
          ulMensajes.innerHTML+=`<li style=" background-color:yellow"> <strong>${nombreEnvia}</strong> ${mensaje}</li>`
        }
    })
  
    //TODO: Codigo para mostrar los usuarios conectados

    //Captura a los sockets que se conectaron 
    socket.on('connect',()=>{
    //Aqui recibo los usuarios conectados del server
    console.log('Usuario conectado',nombreUsuarioConectado,socket.id)

    //Mandamos al server el usuario que se conectó con su socket ID
    socket.emit('usuariosConectados',nombreUsuarioConectado,socket.id) 

    //Recibimos la lista de usuarios conectados
    socket.on('usuariosConectados',listaUsuariosConectados=>{
      //console.log(listaUsuariosConectados)
      ulUsuariosConectados.innerHTML=''
      listaUsuariosConectados.forEach(usuario => {
        ulUsuariosConectados.innerHTML+=`<li> ${usuario.nombreUsuario} </li> <p>ID:${usuario.ID}</p>`
      })
    })
  })

  //TODO: Código para identificar los usuarios desconectados y mostrarlos en el CHAT

  socket.on('usuarioDesconectado',nombre=>{

    const mensajesMostrados=ulMensajes.childElementCount
    if(mensajesMostrados<10){
        ulMensajes.innerHTML+=`<li style=" color: red"> <strong>${nombre}</strong> ha salido del Chat!</li>`
    }
    else{
      const primerMensaje=ulMensajes.firstChild
        ulMensajes.removeChild(primerMensaje)
        ulMensajes.innerHTML+=`<li style=" color: red"> <strong>${nombre}</strong> ha salido del Chat!</li>`
    }

    
  })


  //TODO: Código para cerrar sesión y volver al inicio

  btnSalir.addEventListener('click',()=>{
    window.location.href='http://localhost:8080'
  })
  //


}





const infoUsuario=async()=>{
  //Obtenemos la info del usuario que se conectó
  const resp= await fetch('http://localhost:8080/chat/usuario')

  const {email,nombre}=await resp.json()

  //Recuperamos el nombre
  nombreUsuarioConectado=nombre

  //Una vez obtenemos la info del usuario que se conectó , conectamos el socket para emitir el extraHeader con el usuario Conectado y que se recupera
  // en socketControllers
  await conectarSocket()

} 

//Recordar que el await hace que el codigo espere hasta que todas  las promesas se ejecutes
await infoUsuario()




