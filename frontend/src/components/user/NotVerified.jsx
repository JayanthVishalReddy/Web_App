import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

export default function NotVerified() {
    const { authInfo }= useAuth();
    console.log(authInfo);
     const { isLoggedIn }=authInfo;
    const isVerified =authInfo.profile?.isVerified;
    
    const navigate= useNavigate();
    const navigateToVerification=()=>{
      navigate('/auth/verification', {state:{user:authInfo.profile}});
    }
    return (
      <div>
     {  isLoggedIn && !isVerified ?
       (<p className='text-lg text-center bg-blue-50 p-2'> It Looks like you haven't verified the account, 
          <button className='text-blue-500 font-semibold hover:underline' onClick={navigateToVerification}> 
          CLick here to verify the account </button></p>) : null
          }
      </div>
    );
}
