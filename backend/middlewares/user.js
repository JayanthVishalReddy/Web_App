const { isValidObjectId } = require("mongoose");
const password_reset_token = require("../models/password_reset_token");
const { sendError } = require("../utilities/helper");

exports.isValidPasswordResetToken=async(req,res,next)=>{
    const{token,userId}=req.body;
    if(!token.trim() || !isValidObjectId(userId)) return sendError(res,"Invalid Request");
    const resetToken=await password_reset_token.findOne({owner:userId});
    if(!resetToken) return sendError(res,"Unauthorised access, Invalid request...!"); 
    const matched=await resetToken.compairToken(token);
    if(!matched) return sendError(res,"Unauthorised access, Invalid request...!");
    req.resetToken=resetToken;
    next();
};