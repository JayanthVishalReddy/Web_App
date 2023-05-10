const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(()=>
{
    console.log("Db connected");
}).catch((ex)=>{
    console.log("Db connection failed",ex);
});

//saisanketh407
//hW3FhvplzDHN2tu8
//mongodb://0.0.0.0:27017/review_app 
//mongodb+srv://saisanketh407:hW3FhvplzDHN2tu8@moviereviewapp.1ov1tv8.mongodb.net/moviereviewapp?retryWrites=true&w=majority