const mongoose=require('mongoose');
const itemSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    fromemail:{type:String ,required:true},
    itemName:{type:String , required:true},
    startDate:{type:String, 
           match:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3,12})[a-zA-Z]{3,12}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3,12})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3,12})/,
           },
    endDate:{type:String, 
        match:/((?=\d{4})\d{4}|(?=[a-zA-Z]{3,12})[a-zA-Z]{3,12}|\d{2})((?=\/)\/|\-)((?=[0-9]{2})[0-9]{2}|(?=[0-9]{1,2})[0-9]{1,2}|[a-zA-Z]{3,12})((?=\/)\/|\-)((?=[0-9]{4})[0-9]{4}|(?=[0-9]{2})[0-9]{2}|[a-zA-Z]{3,12})/,
        },
    toemail:{type:String , required:true},
    status:{type:String , require:true},
    teamImage:{type:String , require:true}
    
});

module.exports=mongoose.model('Item',itemSchema);