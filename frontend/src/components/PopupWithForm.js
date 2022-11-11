import React from 'react';
function PopupWithForm({ title, name, isOpen, onClose, onSubmit, onBGClick, buttonState, children }) {
  return (
    <div
      className={isOpen ? "popup popup_opened" : "popup"}
    >
      <div
        className="popup__container"
        onClick={onBGClick}
      >
        <button
          className="popup__close-icon"
          type="button"
          onClick={onClose}>

        </button>
        <form
          className="dialog-form dialog-form_type_popup"
          name={name}
          onSubmit={onSubmit}
          noValidate
        >
          <h2 className="dialog-form__title dialog-form__title_type_popup">
            {title}
          </h2>
          {children}
          <button
            className={`dialog-form__submit-button dialog-form__submit-button_type_popup ${buttonState.disabled ? "dialog-form__submit-button_disabled": ""}`}
            type="submit"
            name="submitButton"
            formMethod="post"
            disabled={buttonState.disabled}
          >
            {buttonState.text}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;