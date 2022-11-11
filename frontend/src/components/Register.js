import React from 'react';
import AuthForm from './AuthForm';

function Register(props) {
  return <AuthForm {...props} isRegForm={true} />  
}

export default Register;