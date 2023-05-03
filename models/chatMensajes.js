
class Mensaje{
    constructor(ID,nombreUsuario,mensaje){
        this.ID=ID
        this.nombreUsuario=nombreUsuario
        this.mensaje=mensaje
    }
}
class Usuario{
    constructor(ID,nombreUsuario){
        this.ID=ID
        this.nombreUsuario=nombreUsuario
    }

    
}

export class ChatMensaje{
    constructor(){
        this.mensajes=[]
        this.usuarios={}
        this.cont=0
        
    }

    enviarMensaje(ID, nombreUsuario, mensaje){
        this.mensaje= new Mensaje(ID,nombreUsuario,mensaje)
        //Agrega el mensaje al inicio del arreglo
        this.mensajes.unshift(this.mensaje)

        return this.mensaje
    }

    conectarUsuario(ID,nombreUsuario){
        this.usuario=new Usuario(ID,nombreUsuario)
        this.cont+=1
        //Agrega al usuario en el {}
        this.usuarios[ID]=(this.usuario)
    }

    desconectarUsuario(ID){
        delete this.usuarios[ID]
    }

    get ultimos10Mensajes(){
        return this.mensajes.slice(0,10)
    }

    get usuariosConectados(){
        //Devuelve un array de objetos
        return Object.values(this.usuarios)
    }
}