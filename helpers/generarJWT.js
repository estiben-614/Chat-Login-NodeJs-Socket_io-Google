import jwt from 'jsonwebtoken';
//Le pasamos el usuario que se encontró en DB con toda su info
export const generarJWT=(usuario)=>{
    return (jwt.sign(usuario,process.env.PRIVATE_KEY_JWT))


}
