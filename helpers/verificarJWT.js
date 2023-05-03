import jwt from "jsonwebtoken"


export const verificarToken=async(token)=>{
    try{
        const decoded=jwt.verify(token,process.env.PRIVATE_KEY_JWT)
        return decoded
    }
    catch(err){
        console.log(err)
    }
}