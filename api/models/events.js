const mongoose=require('mongoose');
const eventSchema=mongoose.Schema({

    _id:mongoose.Schema.Types.ObjectId,
    emailId:{type:String ,required:true},
    subject:{type:String,required:true },
    description:{type:String,required:false },
    startTime:{type:String,required:true},
    endTime:{type:String,required:true},
    startTimezone:{type:String,required:false},
    endTimezone:{type:String,required:false},
    city:{type:String,required:false}
});
module.exports=mongoose.model('Event',eventSchema);