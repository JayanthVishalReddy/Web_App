import React, { useEffect, useState } from 'react'
import { commonModelClasses } from '../../utils/theme';
import Container from '../Container';
import CustomLink from '../CustomLink';
import FormInput from '../Form/FormInput';
import Submit from '../Form/Submit';
import Title from '../Form/Title';
import FormContainer from '../Form/FormContainer';
import { useAuth, useNotification } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '../../utils/helper';

const validateUserInfo=({email,password})=>{
    if(!email.trim()) return {ok:false, error:"email is missing "};
    if(!isValidEmail(email)) return {ok:false, error:"Invalid Email"};
    if(!password.trim()) return {ok:false, error:"password is missing "};
    if(password.length<8) return {ok:false, error:"password must be atleast 8 charecters"};
    return {ok:true};

}


export default function Signin() {

    const[userInfo,setUserInfo]=useState({
        email:"",
        password:"",
    });  
const navigate=useNavigate();
    const {updateNotification}=useNotification();
    const{handleLogin, authInfo}=useAuth();
   const{isPending,isLoggedIn}=authInfo;
   console.log(authInfo); 
    const handleChange=({target})=>{
        const {value,name}=target;
        setUserInfo({...userInfo,[name]:value})
    };

    const handleSubmit= async(e)=>{
        e.preventDefault();
        const {ok,error}= validateUserInfo(userInfo);
        if(!ok) return updateNotification('error',error);
        handleLogin(userInfo.email, userInfo.password);
      
    };
// useEffect(()=>{
// if(isLoggedIn) navigate('/'); 
// },[isLoggedIn]);
  return (
    <FormContainer>
        <Container>
            <form onSubmit={handleSubmit} className={commonModelClasses+ ' w-72'}>
                <Title>Sign in</Title>
                <FormInput value={userInfo.email} onChange={handleChange} label="Email" placeholder="john@gmail.com" name="email"/>
                <FormInput value={userInfo.password} onChange={handleChange} label="Password" placeholder="********" name="password"  
                type="password" />
                <Submit value="Sign in" busy={isPending}/>

                <div className='flex justify-between'>
                    <CustomLink 
                    to='/auth/forgot-password'> Forgot Password</CustomLink>
                    <CustomLink 
                    to='/auth/signup'> Sign up</CustomLink>
                </div>
            </form>
        </Container>     
        </FormContainer>
  );
}
