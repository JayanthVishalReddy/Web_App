const nodemailer=require("nodemailer");
const jwt=require("jsonwebtoken");
const User = require("../models/user");
const emailVerificationToken = require("../models/emailVerificationToken");
const PasswordRestToken = require("../models/password_reset_token");
const { body } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const { json } = require("express");
const { generateOTP, generateMailTransporter } = require("../utilities/mail");
const { sendError, generateRandomByte } = require("../utilities/helper");
const password_reset_token = require("../models/password_reset_token");
exports.create= async(req,res)=>{
    const{name,email,password}=req.body;
    const oldUser=await User.findOne({email});
    if(oldUser){
        return sendError(res,"This email Id is already in Use..!");
    }
    const newUser=new User({name,email,password});
    await newUser.save();

    //create 6 didgit OTP, store it into DB and send verification mail to user

let OTP=generateOTP();
//saving to DB
const newEmailVerificationToken=new emailVerificationToken({
    owner:newUser._id,
    token:OTP, 
});
await newEmailVerificationToken.save();

//sending Email
var transport = generateMailTransporter();
  transport.sendMail({
    from:'imdb12@gmail.com',
    to:newUser.email,
    subject:'Email Verification',
    html:`
    <p> Your Verification OTP is</p>
    <h1>${OTP}</h1>
    `,
  });

res.status(201).json({
  user:{
    id:newUser._id,
    name: newUser.name,
    email:newUser.email,
  }
});
}; 

exports.verifyEmail=async(req,res)=>{
    const{userId,OTP}=req.body;
    if(!isValidObjectId(userId))  return res.json({error:"Invalid User...!"});
    const user=await User.findById(userId);
    if(!user) return sendError(res,"User not found..!!",404);
    if(user.isVerified) return sendError(res,"User already Verified");
   const token= await emailVerificationToken.findOne({owner:userId});
   if(!token) return sendError(res,"token not found..!");
   const isMatched=await token.compairToken(OTP);
   if(!isMatched){
    return sendError(res,"Please enter valid OTP");
   }
   user.isVerified=true;
   await user.save();
   await emailVerificationToken.findByIdAndDelete(token._id);
   var transport = generateMailTransporter();

  transport.sendMail({
    from:'imdb12@gmail.com',
    to:user.email,
    subject:'Welcome Email',
    html:"<h1> Welcome to our APP</h1>"
  });

  const jwtToken=jwt.sign({userId:user._id}, process.env.JWT_SECRET);
  res.json({
    user:{id:user._id, name:user.name, email:user.email,token:jwtToken, isVerified:user.isVerified,role:user.role},
    message:"Your email is verified", 
  });
};

exports.resendEmailVerificationToken= async (req,res)=>{
    const {userId}=req.body;
    const user=await User.findById(userId);
    if(!user) return sendError(res,"User not found..!"); 
    if(user.isVerified) return sendError(res,"User already Verified"); 
    const alreadyHasToken= await emailVerificationToken.findOne({owner:userId});
   if(alreadyHasToken) return sendError(res,"You can request token only after 1 hour"); 

   let OTP=generateOTP();
//saving to DB
const newEmailVerificationToken=new emailVerificationToken({
    owner:user._id,
    token:OTP, 
});
await newEmailVerificationToken.save();

//sending Email
var transport = generateMailTransporter();

  transport.sendMail({
    from:'imdb12@gmail.com',
    to:user.email,
    subject:'Email Verification',
    html:`
    <p> Your Verification OTP is</p>
    <h1>${OTP}</h1>
    `,
  });
    res.json({message:"New OTP has sent to your registered email account"});
};

exports.forgetPassword=async(req,res)=>{
    const{email}=req.body;
    if(!email){
        return sendError(res,"email is missing");
    }
    const user=await User.findOne({email});
    if(!user) return sendError(res,"User not Found",404);
    const alreadyHasToken=await PasswordRestToken.findOne({owner:user._id});
    if(alreadyHasToken) return sendError(res,"Please try again after 1 hour ");
    const token=await generateRandomByte();
    const newPasswordResetToken=await PasswordRestToken({
        owner:user._id,
        token
    });
    await newPasswordResetToken.save();
    const passwordRestUrl=`http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

    const transport = generateMailTransporter();
  transport.sendMail({
    from:'security@gmail.com',
    to:user.email,
    subject:'Reset Password',
    html:`
    <p> Click to reset password</p>
    <a href='${passwordRestUrl}'> click here</a>
    `,
  });

  res.json({message:"Link sent to your email"});
};
exports.sendResetPasswordTokenStatus=(req,res)=>{
    res.json({valid:true});
};
exports.resetPassword= async(req,res)=>{
   const {newPassword,userId}=req.body;
    const user=await User.findById(userId);
    const matched=await user.comparePassword(newPassword);
    if(matched) return sendError(res,"The Password must be different from old one!");
    user.password=newPassword;
    await user.save();
    await password_reset_token.findByIdAndDelete(req.resetToken._id);
    const transport = generateMailTransporter();
    transport.sendMail({
      from:'security@gmail.com',
      to:user.email,
      subject:'Password Reset Successfully',
      html:`
      <h1> Password Reset Successfully</h1>
      <p>Now you can use new password</p>
      `,
    });
    res.json({message:"Password Reset Successfully,Now you can use new password"});
};

exports.signIn= async(req,res)=>{
    const{email,password}=req.body;
    const user=await User.findOne({email});
    if(!user) return sendError(res,"email/password mismatch");
    const matched=await user.comparePassword(password);
    if(!matched) return sendError(res,"email/password mismatch");
    const {_id,name, role, isVerified}=user;
    const jwtToken=jwt.sign({userId:_id}, process.env.JWT_SECRET);
        res.json({user:{id:_id,name,email,role,token:jwtToken, isVerified}});

};