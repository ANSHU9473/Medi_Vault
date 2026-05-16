const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
            type:Number,
          
    },
    accountType: {
        type: String,
        default: 'individual'
    },
    familyMembers: {
        type: Array,
        default: []
    },
    emergencyProfile: {
        type: Object,
        default: {}
    }
})

module.exports=mongoose.model('User',userSchema);