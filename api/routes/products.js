const express=require('express');
const { Mongoose } = require('mongoose');
const Product=require('../models/product');
const mongoose=require('mongoose');
const router=express.Router();
const checkAuth=require('../middleware/check-auth');
//import multer for file upload
const multer=require('multer');
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
    Product.find()
    .select("name _id productImage")
    .exec()
    .then(doc=>{
        // which will allow nly specific fields
        const response={
            count:doc.length,
            products:doc.map(doc=>{
                return{
                    name:doc.name,
                    price:doc.price,
                    _id:doc._id,
                    productImage:doc.productImage,
                    request:{
                        //can give any type and url whichever we want to execute after clicking on it (metadat)
                        type:'GET',
                        url:'http://localhost:3000/products/'+doc._id
                    }
                }
            })
        };
        // if(doc.length>0){
             res.status(200).json(response);
        // }
        // else{
        //     res.status(404).json({
        //         message:'Empty Products !'
        //     });
        // }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })
  });

router.post('/',upload.single('productImage'), checkAuth,(req,res,next)=>{
    //can see file details 
    //console.log(req.file);
    //create instance of the Product model
    const product =new Product({
        //create unique id each time
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    });
    //save will store data in db check result and catch
    product
    .save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message:'Created product successfull !',
            createdProduct :{
                name:result.name,
                price:result.price,
                _id:result._id,
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

router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId;
   Product.findById(id)
   .select("name price _id productImage")
   .exec()
   .then(doc=>{
       console.log('From database',doc);
       if(doc){
           res.status(200).json({
               product:doc,
               request:{
                   type:'GET',
                   url:'http://localhost:3000/products/'+doc._id
               }
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

router.patch('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.updateOne({_id:id},{$set:updateOps})
    .exec()
    .then(doc=>{
        console.log(doc);
        if(doc){
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

router.delete('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    Product.remove({_id:id})
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