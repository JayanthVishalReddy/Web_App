import React, { useEffect, useState } from 'react'
import Container from '../Container';
import FormInput from '../Form/FormInput';
import CustomLink from '../CustomLink';
import { useNavigate } from 'react-router-dom';
import Submit from '../Form/Submit';
import Title from '../Form/Title';
import { commonModelClasses } from '../../utils/theme';
import FormContainer from '../Form/FormContainer';
import { createUser } from '../../api/auth';
import { useAuth, useNotification } from '../../hooks';
import { isValidEmail } from '../../utils/helper';

const validateUserInfo=({name,email,password})=>{
    const isValidName=/^[a-z A-Z]+$/;
    if(!name.trim()) return {ok:false, error:"name is missing "}; 
    if(!isValidName.test(name)) return {ok:false, error:"name is not valid"};
    if(!email.trim()) return {ok:false, error:"email is missing "};
    if(!isValidEmail(email)) return {ok:false, error:"Invalid Email"};
    if(!password.trim()) return {ok:false, error:"password is missing "};
    if(password.length<8) return {ok:false, error:"password must be atleast 8 charecters"};
    return {ok:true};

}
export default function Signup () {
    const[userInfo,setUserInfo]=useState({
        name:"",
        email:"",
        password:"",
    }); 
const navigate=useNavigate(); 
const{authInfo}=useAuth();
const {isLoggedIn}=authInfo;
const {updateNotification}=useNotification();
    const handleChange=({target})=>{
        const {value,name}=target;
        setUserInfo({...userInfo,[name]:value})
    };
    const handleSubmit= async(e)=>{
        e.preventDefault();
        const {ok,error}= validateUserInfo(userInfo);
        if(!ok) return updateNotification('error',error);
       const response=await createUser(userInfo);
       if(response.error) return console.log(response.error);
       navigate('/auth/verification',{state:{user:response.user},replace:true});
       console.log(response.user);
    };
    useEffect(()=>{
        if(isLoggedIn) navigate('/'); 
        },[isLoggedIn]);
    const{name,email,password}=userInfo;
  return (
    <FormContainer>
        <Container>
            <form onSubmit={handleSubmit} className={commonModelClasses+ ' w-72'}>
                <Title>Sign up</Title>
                <FormInput value={name} onChange={handleChange} label="Name" placeholder="John" name="name"/>
                <FormInput value={email} onChange={handleChange} label="Email" placeholder="john@gmail.com" name="email"/>
                <FormInput value={password} onChange={handleChange} label="Password" placeholder="********" name="password" type="password"/>
                <Submit value="Sign up"/>

                <div className='flex justify-between'>
                <CustomLink 
                    to='/auth/forgot-password'> Forgot Password</CustomLink>
                    <CustomLink 
                    to='/auth/signin'> Sign in</CustomLink>
                </div>
            </form>
        </Container>     
    </FormContainer>
  );
}
