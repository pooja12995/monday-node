const mongoose=require('mongoose');
const chatSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    fromemail:{type:String ,required:true},
    message:{type:String , required:true},
    sentDate:{type:String},
    toemail:{type:String,required:true}
});

module.exports=mongoose.model('Chat',chatSchema);