import mongoose from "mongoose";

export const dbConeccion=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_CNN)
        console.log('Base de datos conectada')
    }
    catch(err){
        console.log(err)
    }
}