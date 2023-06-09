
import client from "./client";

 export const createUser= async(userInfo)=>{
    try{
   const {data}= await client.post('/create',userInfo);
   return data;
    } catch(error){
        const {response}=error;
        if(response?.data) return response.data;
         return {error:error.message || error};
    }
 };
 export const verifyUserEmail= async(userInfo)=>{
    try{
   const {data}= await client.post('/verify-email',userInfo);
   return data;
    } catch(error){
        console.log(error.response?.data);
        const {response}=error;
        if(response?.data) return response.data;
         return {error:error.message || error};
    }
 };
 export const signInUser = async(userInfo)=>{
   try{
  const {data}= await client.post('/sign-in',userInfo);
  return data;
   } catch(error){
       console.log(error.response?.data);
       const {response}=error;
       if(response?.data) return response.data;
        return {error:error.message || error};
   }
};

export const getIsAuth = async(token)=>{
   try{
  const {data}= await client.get('/is-auth',{
   headers:{
      Authorization:"Bearer "+token,
      accept:"application/json",
   },
  });
  return data;
   } catch(error){
       console.log(error.response?.data);
       const {response}=error;
       if(response?.data) return response.data;
        return {error:error.message || error};
   }
};

export const forgetPassword = async(email)=>{
   try{
  const {data}= await client.post('/forgot-password',{email});
  return data;
   } catch(error){
       console.log(error.response?.data);
       const {response}=error;
       if(response?.data) return response.data;
        return {error:error.message || error};
   }
};

export const verifyPasswordRestToken = async(token,userId)=>{
   try{
  const {data}= await client.post('/verify-password-reset-token',{token,userId});
  return data;
   } catch(error){
       console.log(error.response?.data);
       const {response}=error;
       if(response?.data) return response.data;
        return {error:error.message || error};
   }
};

export const resetPassword = async(passwordInfo)=>{
   try{
  const {data}= await client.post('/reset-password',passwordInfo);
  return data;
   } catch(error){
       console.log(error.response?.data);
       const {response}=error;
       if(response?.data) return response.data;
        return {error:error.message || error};
   }
};

export const resendEmailVerificationToken = async(userId)=>{
   try{
  const {data}= await client.post('/resend-email-verification-token',{ userId });
  return data;
   } catch(error){
       console.log(error.response?.data);
       const {response}=error;
       if(response?.data) return response.data;
        return {error:error.message || error};
   }
};