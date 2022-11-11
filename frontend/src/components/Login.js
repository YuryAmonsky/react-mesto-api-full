import React from 'react';
import AuthForm from './AuthForm';

function Login(props) {

 return <AuthForm {...props} isRegForm={false}/>
}

export default Login;