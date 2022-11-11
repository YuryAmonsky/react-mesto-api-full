import React from "react";
import iconSuccess from "../images/ui/reg-success.svg";
import iconError from "../images/ui/reg-error.svg";;

function InfoTooltip({ isOpen, success, message, onClose, onBGClick }) {

  return (
    <div className={isOpen ? "popup popup_opened" : "popup"}>
      <div
        className="popup__container"
        onClick={onBGClick}
      >
        <button
          className="popup__close-icon"
          type="button"
          onClick={onClose}>

        </button>
        <div className="infotooltip" >

          <img
            className="infotooltip__image"
            src={success ? iconSuccess : iconError}
            alt={success ? "кружок с галочкой" : "кружок с крестиком"}
          ></img>
          <p className="infotooltip__message">{message}</p>

        </div>
      </div>
    </div>
  );
}
export default InfoTooltip;