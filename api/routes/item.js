const express=require('express');
const { Mongoose } = require('mongoose');
const Item=require('../models/items');
const mongoose=require('mongoose');
const router=express.Router();
const checkAuth=require('../middleware/check-auth');
//import multer for file upload
const multer=require('multer');
const { find } = require('../models/items');
//some extra changes in file upload
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
 
const fileFilter=(req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    {
        cb(null,true);
    }
    else{
        cb(new Error('Only JPEG and PNG file'),false);
    }
}

const upload=multer({storage : storage ,limits:{
    fileSize:1024*1024*5 
    //only upto 5MB file size
},
   fileFilter:fileFilter
});

router.get('/', (req,res,next)=>{
    Item.find()
    .select("itemName _id startDate endDate toemail fromemail status teamImage")
    .exec()
    .then(doc=>{
        // which will allow nly specific fields
                        
         if(doc.length>0){
             res.status(200).json(doc);
             
         }
         else{
             res.status(404).json({
                 message:'Empty Products !'
             });
         }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })
  });

router.post('/',upload.single('teamImage'),checkAuth,(req,res,next)=>{
    //can see file details 
    //console.log(req.file);
    //create instance of the Product model
    const item =new Item({
        //create unique id each time
        _id:new mongoose.Types.ObjectId(),
        fromemail:req.body.fromemail,
        itemName:req.body.itemName,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        toemail:req.body.toemail,
        status:req.body.status,
        teamImage:req.file.path
    });
    //save will store data in db check result and catch
    item
    .save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message:'Create Item successfull !',
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });  
});

router.get('/:fromemail',(req,res,next)=>{
    const email=req.params.fromemail;
   Item.find({fromemail:email})
   .select("itemName _id startDate endDate toemail fromemail status teamImage")
   .exec()
   .then(doc=>{
       console.log('get from email');
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


router.get('/:toemail/:_id/:_id',(req,res,next)=>{
    const email=req.params.toemail;
   Item.findOne({toemail:email})
   .select("itemName _id startDate endDate toemail fromemail status teamImage")
   .exec()
   .then(doc=>{
       console.log('checking if to email works !',doc);
       if(doc){
           res.status(200).json({
               product:doc
                 });
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


router.get('/:status/:fromemail',(req,res,next)=>{
   const stat=req.params.status;
   const email=req.params.fromemail;
   Item.find({status:stat ,fromemail:email})
   .exec()
   .then(doc=>{
       if(doc.length>=1){
        res.status(200).json(doc);
       }
       else{
           res.status(404).json({message:'Not found !'});
       }
   }).
   catch(err=>{
       res.status(500).json({error:err});
   });
});



router.patch('/:_id',(req,res,next)=>{
    const id=req.params._id;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Item.updateOne({_id:id},{$set:updateOps})
    .exec()
    .then(doc=>{
        console.log(doc);
        if(doc.length>=1){
            res.status(200).json({message:'Recored updated successfull !'});
        }
        else{
            res.status(404).json({
                message:'No recored found to update !'
            });
        }
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({error:err});
    });
    
});

router.put('/:_id',(req,res,next)=>{
    const id=req.params._id;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Item.updateOne({_id:id},{$set:updateOps})
    .exec()
    .then(doc=>{
        console.log(doc);
        if(doc.length>=1){
            res.status(200).json({message:'Recored updated successfull !'});
        }
        else{
            res.status(404).json({
                message:'No recored found to update !'
            });
        }
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({error:err});
    });
    
});

router.delete('/:',(req,res,next)=>{
    const eid=req.params.itemId;
    Item.remove({_id:eid})
    .exec()
    .then(doc=>{
        console.log(doc);
        if(doc){
            res.status(200).json({
                message: 'Product has been Deleted ! :)'
              });
        }
        else{
            res.status(404).json({
                message: 'No such product Found !'
              });
        }
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({error:err});
    });
   
});

router.delete('/:itemId',(req,res,next)=>{
    const eid=req.params.itemId;
    Item.remove({_id:eid})
    .exec()
    .then(doc=>{
        console.log(doc);
        if(doc){
            res.status(200).json({
                message: 'Product has been Deleted ! :)'
              });
        }
        else{
            res.status(404).json({
                message: 'No such product Found !'
              });
        }
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({error:err});
    });
   
});

module.exports=router;