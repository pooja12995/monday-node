const express=require('express');
const router=express.Router();

router.get('/', (req,res,next)=>{
    res.status(200).json({
        message:'orders has been fetched !'
    });
});

router.post('/', (req,res,next)=>{
    const order ={
        orderId: req.body.orderId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message:'Orders are created !',
        order : order
    });
});

router.get('/:orderId', (req,res,next)=>{
    res.status(200).json({
        message:'Order details',
        orderId : req.params.orderId
    });
}); 

router.delete('/:orderId', (req,res,next)=>{
    
    res.status(200).json({
        message:'Order deleted !',
        orderId : req.params.orderId
    });
}); 

module.exports=router;