const express=require('express');
const { Mongoose } = require('mongoose');
const Chat=require('../models/chats');
const mongoose=require('mongoose');
const router=express.Router();
const checkAuth=require('../middleware/check-auth');

router.get('/:toemail',(req,res,next)=>{
    const email=req.params.toemail;
   Chat.find({toemail:email})
   .then(doc=>{
       if(doc.length>=1)
       {
           res.status(200).json(doc);
       }
       else{
           res.status(404).json({message:'No Inbox !'});
       }
   })
   .catch(err=>{
       res.status(500).json({error:err});
   })
});

router.post('/',(req,res,next)=>{
    const chat =new Chat({
        //create unique id each time
        _id:new mongoose.Types.ObjectId(),
        message:req.body.message,
        fromemail:req.body.fromemail,
        toemail:req.body.toemail,
        sentDate:req.body.sentDate
    });
    chat
    .save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message:'Message sent successfull !',
            createdProduct :{
                _id:result._id,
                 message:result.message,
                 fromemail:result.fromemail,
                 toemail:result.toemail,
                 sentDate:result.sentDate,
                request:{
                   type:'GET',
                   url:'http://localhost:3000/products/'+result._id
                }
            }
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });  
});

router.delete('/:chatId',(req,res,next)=>{
    const id=req.params.chatId;
    Chat.remove({_id:id})
    .exec()
    .then(doc=>{
        console.log(doc);
        if(doc){
            res.status(200).json({
                message: 'Chat has been Deleted ! :)'
              });
        }
        else{
            res.status(404).json({
                message: 'Not Found !'
              });
        }
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({error:err});
    });
   
});

module.exports=router;