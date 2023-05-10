import React, { useEffect, useState } from 'react'
import { commonModelClasses } from '../../utils/theme';
import Container from '../Container';
import FormContainer from '../Form/FormContainer';
import FormInput from '../Form/FormInput';
import Submit from '../Form/Submit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Title from '../Form/Title';
import { ImSpinner3 } from 'react-icons/im';
import { useNotification } from '../../hooks';
import { resetPassword, verifyPasswordRestToken } from '../../api/auth';

export default function ConfirmPassword() {
    const [password,setPassword]=useState({
        one:'',
        two:'',
    }); 
    const [isVerifying,setIsVerifying]=useState(true);
    const [isValid,setIsValid]=useState(false);
    const [searchParam]=useSearchParams();
    const token=searchParam.get('token');
    const id=searchParam.get('id');
    const {updateNotification}=useNotification();
    const navigate=useNavigate();
    useEffect(()=>{
        isValidToken();
    },[]);
    const isValidToken= async()=>{
        const{error,valid}=await verifyPasswordRestToken(token,id);
        setIsVerifying(false);
if(error) {
    navigate("/auth/reset-password",{replace:true});
    return updateNotification("error",error);
}
        if(!valid) {
            setIsValid(false);
             
            return navigate("/auth/reset-password",{replace:true});
        }
        setIsValid(true);
    }
    const handleChange=({target})=>{
        const {name,value}=target;
        setPassword({...password,[name]:value});
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(!password.one.trim()) return updateNotification("error", "Password is Missing");
        if(password.one.trim().length<8) return updateNotification("error", "Password must be atleast 8 charecters");
        if(password.one!==password.two) return updateNotification("error", "Passwords do not match");
        const {error,message}= await resetPassword({newPassword:password.one, userId: id, token});
        if(error) return updateNotification("error", error);
        updateNotification("success",message);
        navigate('/auth/signin', {replace:true});
    }
    if(isVerifying)
    return(
        <FormContainer>
        <Container>
            <div className='flex space-x-2 items-center'>
            <h1 className='text-4xl font-semibold dark:text-white text-primary'>
                We are verifying your token</h1>
                <ImSpinner3 className='animate-spin text-4xl  dark:text-white text-primary'/>
            </div>
        </Container>
        </FormContainer>
    );
    if(!isValid)
    return(
        <FormContainer>
        <Container>
            <div className='flex space-x-2 items-center'>
            <h1 className='text-4xl font-semibold dark:text-white text-primary'>
                Sorry the token is Invalid..!</h1>
               
            </div>
        </Container>
        </FormContainer>
    );
    return  (
        <FormContainer>
        <Container>
            <form onSubmit={handleSubmit } className= {commonModelClasses+' w-96 '}>
                <Title>Please Enter New Password</Title>
                <FormInput label="New Password" value={password.one} onChange={handleChange} 
                placeholder="********" name="one" type="password" />
                <FormInput label="Confirm Password" value={password.two} onChange={handleChange}
                 placeholder="********" name="two" type="password" />
                <Submit value="Confirm Password"/>
            </form>
        </Container>     
      </FormContainer>);
}
