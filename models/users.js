import mongoose from "mongoose";
const {Schema,model}=mongoose

const UserSchema= new Schema({
    nombre:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:false
    },
    google:{
        type:Boolean,
        default:true
    },
    usuario:{
        type:String
    }
})

export const userModel=model('User',UserSchema)