import React from "react";

function BurgerNavBar({isBurgerOpen, userEmail, onButtonClick}){
  return (
    <div className={`burger-nav-bar ${isBurgerOpen ? "burger-nav-bar_is-open" : ""}`}>
        <p className="nav-bar__user-name">{userEmail}</p>
        <button
          className="nav-bar__button"
          onClick={onButtonClick}
          type="button"
        >
          Выйти
        </button>
      </div>
  )
}

export default BurgerNavBar;