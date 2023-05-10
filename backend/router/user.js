const { response } = require('express');
const express=require('express');
const jwt=require('jsonwebtoken');

const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn } = require('../controllers/user');
const { isAuth } = require('../middlewares/auth');
const { isValidPasswordResetToken } = require('../middlewares/user');
const { userValidator,validate, validatePassword, signInValidator } = require('../middlewares/validator');
const User = require('../models/user');
const { sendError } = require('../utilities/helper');
const router=express.Router();

router.post("/create",userValidator,validate, create);
router.post("/sign-in",signInValidator,validate, signIn);
router.post("/verify-email",verifyEmail);
router.post("/resend-email-verification-token",resendEmailVerificationToken);
router.post("/forgot-password",forgetPassword);
router.post("/verify-password-reset-token",isValidPasswordResetToken,sendResetPasswordTokenStatus);
router.post("/reset-password",validatePassword,validate,isValidPasswordResetToken,resetPassword);
router.get("/is-auth", async(req,res)=>{
    const token=req.headers?.authorization;
    console.log(token);
    const jwtToken=token.split("Bearer ")[1];
    if(!jwtToken) return sendError(res,"Invalid Token");
    const decode=jwt.verify(jwtToken,process.env.JWT_SECRET);
    const {userId}=decode;
    const user= await User.findById(userId);
    if(!user){
        return sendError(res,"invalid Token",404);
    }
    req.user=user;
    res.json({user:{id:user._id,name:user.name,email:user.email, isVerified:user.isVerified, role:user.role}});
}
);
 
module.exports=router;