import { googleVerify } from "../helpers/googleVerify.js"
import { userModel } from "../models/users.js"


export const userExiste=async (req,res,next)=>{
   

        //Obtenemos el email que viene en el body del registro manual
        const{email}=req.body
        
        //Buscamos en la BD si ese usuario existe con el email y lo devuelve si existe 
        const existeEmail=await userModel.findOne   ({email})
        if(existeEmail){
            res.json({
                msg:`El correo ${existeEmail.email} ya existe`
            })
            console.log(`El correo ${existeEmail.email} ya existe`)
        }
        //Si no  existe, continua para luego crearlo 
        else{
            next()
            }
    }




     // //Obtenemos lo que venga en el body, puede ser el token_id de google o el usuarip/password del registro manual
    // const data=req.body

    // //Si viene el token de google
    // if(data.token_id!==undefined){
    //         //Recibimos el token
    //     const {token_id}=req.body
    //     //Decodificamos el token
    //     const {email}= await googleVerify(token_id)
        
    //     //Buscamos en la BD si ese usuario existe con el email y lo devuelve si existe 
    //     const existeEmail=await userModel.findOne   ({email})
    //     if(existeEmail){
    //         res.json({
    //             msg:`El correo ${existeEmail.email} ya existe`
    //         })
    //         console.log(`El correo ${existeEmail.email} ya existe`)
    //     }
    //     //Si no  existe, continua para luego crearlo 
    //     else{
    //         next()
    //         }
    // }
    // else{