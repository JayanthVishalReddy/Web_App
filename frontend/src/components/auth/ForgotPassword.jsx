import React, { useState } from 'react'
import { forgetPassword } from '../../api/auth';
import { useNotification } from '../../hooks';
import { isValidEmail } from '../../utils/helper';
import { commonModelClasses } from '../../utils/theme';
import Container from '../Container';
import CustomLink from '../CustomLink';
import FormContainer from '../Form/FormContainer';
import FormInput from '../Form/FormInput';
import Submit from '../Form/Submit';
import Title from '../Form/Title';

export default function ForgotPassword() {
    const [email,setEmail]=useState('');
    const {updateNotification}=useNotification();
    const handleChange=({target})=>{
        const {value}=target;
        setEmail(value);
    };

    const handleSubmit= async(e)=>{
        e.preventDefault();
        if(!isValidEmail(email)) return updateNotification('error', 'Invalid Email');
        const {error,message}= await forgetPassword(email);
        if(error) return updateNotification('error',error);
        updateNotification('success',message);
    };
  return  (
  <FormContainer>
  <Container>
      <form onSubmit={handleSubmit} className={commonModelClasses+' w-96'}>
          <Title>Please Enter Your Email Address</Title>
          <FormInput onChange={handleChange} value={email} label="Email" placeholder="god@gmail.com" name="email"/>
          <Submit value="Send Link"/>

          <div className='flex justify-between'>
              <CustomLink 
              to='/auth/signin'> Sign in</CustomLink>
              <CustomLink 
              to='/auth/signup'> Sign up</CustomLink>
          </div>
      </form>
  </Container>     
</FormContainer>
);
}
