const express=require('express');
const { Mongoose } = require('mongoose');
const Event=require('../models/events');
const mongoose=require('mongoose');
const router=express.Router();
const checkAuth=require('../middleware/check-auth');

//you have taken latest pull


router.get('/:email',(req,res,next)=>{
    const email=req.params.email;
   Event.find({emailId:email})
   .select("_id subject description startTime endTime startTimezone endTimezone city")
   .exec()
   .then(doc=>{
       
       if(doc){
           res.status(200).json(doc);
       }
       else{
           res.status(404).json({
               message :' Not found !'
           })
       }
   })
   .catch(err=>{
       console.log(err);
       res.status(500).json({error:err});
   });
});

router.post('/',(req,res,next)=>{
   console.log(req.body.Subject);
    const event =new Event({
        //create unique id each time
        _id:new mongoose.Types.ObjectId(),
        emailId:req.body.emailId,
        subject:req.body.Subject,
        description:req.body.Description,
        startTime:req.body.StartTime,
        endTime:req.body.EndTime,
        startTimezone:req.body.StartTimezone,
        endTimezone:req.body.EndTimezone,
        city:req.body.City
    });

    //save will store data in db check result and catch
    event
    .save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message:'Create Event successfull !',
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });  
});

module.exports=router;