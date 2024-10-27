const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{type:String},
    email:{type:String,required:true,lowecase:true,trim:true},
    password:{type:String,required:true},
    resetPasswordToken: { type: String }, 
    resetPasswordExpires: { type: Date }   
})
const Users=mongoose.model("Users",userSchema)
module.exports=Users

