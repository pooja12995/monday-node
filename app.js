const express=require('express');
const app=express();
const morgan=require('morgan');
const mongoose=require('mongoose');

const bodyParser=require('body-parser');
const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');
const userRoutes=require('./api/routes/user');
const itemRoutes=require('./api/routes/item');
const chatRoutes=require('./api/routes/chat');


mongoose.connect(
    "mongodb+srv://devthorat:"
    +process.env.MONGO_ATLAS_PW+
    "@workspace.nen3u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true});

    const connection = mongoose.connection;

    connection.once("open", function() {
      console.log("MongoDB database connection established successfully");
    });

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// course error handling
app.use((req,res,next)=>{
    //* can be replaced by our site url like https://monday.com
    res.header("Access-Control-Allow-Origin","*");
   res.header(
       "Access-Control-Allow-Headers",
       "Origin, X-Requested-With, Content-Type, Accept ,Authorization"
   );
   if(req.method==='OPTIONS'){
       res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({});
   }
   next();
});
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);
app.use('/item',itemRoutes);
app.use('/chat',chatRoutes);
//error handling 

app.use((req,res,next)=>{
   const error=new Error('Not Found !');
   error.status=404;
   next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports=app;