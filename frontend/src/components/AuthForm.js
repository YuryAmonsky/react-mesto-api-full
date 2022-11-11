import React, { useEffect} from 'react';
import useFormValidator from "../hooks/useFormValidator";

function AuthForm({ title, name, onOpen, onSubmit, onFormValidate, buttonState, isRegForm, children }) {  
  const { inputs, cbResetValidator, cbFormValidate } = useFormValidator(name, onFormValidate);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onSubmit(
      inputs.email?.value,
      inputs.password?.value
    );
  }

  useEffect(() => {
    cbResetValidator(true, false);
    onOpen();
  }, [cbResetValidator, onOpen]);

  return (
    <div className="form-container">

      <form
        className="dialog-form dialog-form_type_section"
        name={name}
        id={name}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="dialog-form__title dialog-form__title_type_section">
          {title}
        </h2>
        <input
          className={inputs?.email?.shouldShowError ? "dialog-form__input dialog-form__input_type_section dialog-form__input_invalid"
            : "dialog-form__input dialog-form__input_type_section"}
          name="email"
          id="email"
          type="email"
          placeholder="Email"
          value={inputs?.email?.value || ""}
          minLength="8"
          maxLength="50"
          required
          autoComplete="off"
          onInput={cbFormValidate}
          onBlur={cbFormValidate}
        />
        <span className="dialog-form__input-error">
          {inputs?.email?.shouldShowError ? inputs?.email?.error : ""}
        </span>
        <input
          className={inputs?.password?.shouldShowError ? "dialog-form__input dialog-form__input_type_section dialog-form__input_invalid"
            : "dialog-form__input dialog-form__input_type_section"}
          name="password"
          id="password"
          type="password"
          placeholder="Пароль"
          value={inputs?.password?.value || ""}
          minLength="8"
          maxLength="200"
          required
          autoComplete="off"
          onInput={cbFormValidate}
          onBlur={cbFormValidate}
        />
        <span className="dialog-form__input-error input-edit-profile-about-me-error">
          {inputs?.password?.shouldShowError ? inputs?.password?.error : ""}
        </span>
        <button
          className={buttonState.disabled ? "dialog-form__submit-button dialog-form__submit-button_type_section dialog-form__submit-button_disabled"
            : "dialog-form__submit-button dialog-form__submit-button_type_section"}
          type="submit"
          name="submitButton"
          formMethod="post"
          disabled={buttonState.disabled}
        >
          {buttonState.text}
        </button>
        {isRegForm ? 
          <div className="dialog-form__redirect">
            <p className="dialog-form__redirect-text">Уже зарегистрированы?</p>
            {children}
          </div>
        : 
          <></>
        }
      </form>
    </div>
  );
} 

export default AuthForm;