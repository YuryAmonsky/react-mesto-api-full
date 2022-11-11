import React from 'react';
import logo from '../images/logo/logo.svg';

function Header(props) {
  return (
    <>      
      <header className="header">
        <img className="logo" src={logo} alt="Место" />
        {props.children}
      </header>
    </>
  );

}

export default Header;