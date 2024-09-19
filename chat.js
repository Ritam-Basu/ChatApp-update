//mongoose schema
const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    sender:String,
    id:number,  
    receiver:String,
    msg:String,
    timestamp:{
        type:Date,
        default:Date.now,
    }
});


const chat=mongoose.model('chat',messageSchema);
module.exports=chat;