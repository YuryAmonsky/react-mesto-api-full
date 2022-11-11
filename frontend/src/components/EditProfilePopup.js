import { useContext, useEffect } from "react";
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import useFormValidator from "../hooks/useFormValidator";

function EditProfilePopup({ isOpen, onUpdateUser, onFormValidate, ...commonProps }) {
  const currentUser = useContext(CurrentUserContext);
  const { inputs, setInputs, cbResetValidator, cbFormValidate } = useFormValidator('edit-profile', onFormValidate);
  
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onUpdateUser({ name: inputs?.name.value, about: inputs?.aboutMe.value });
  }

  /**Инициализация инпутов при закрытии попапа значениями из currentUser */
  useEffect(() => {
    if (!isOpen) {      
      setInputs(
        {
          name: 
          {
            value: currentUser.name,
            valid: true,
            error: '',
            shouldShowError: false
          },
          aboutMe:
          {
            value: currentUser.about,
            valid: true,
            error: '',
            shouldShowError: false
          }
        }
      );
    } else {
      cbResetValidator(isOpen, true);
    }
  }, [isOpen, currentUser, setInputs, cbResetValidator]);

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="edit-profile"
      id="edit-profile"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      {...commonProps}
    >
      <input
        className={inputs?.name?.shouldShowError ? "dialog-form__input dialog-form__input_type_popup dialog-form__input_invalid"
          : "dialog-form__input dialog-form__input_type_popup"}
        name="name"
        id="input-edit-profile-name"
        type="text" placeholder="Имя"
        value={inputs?.name?.value || ""}
        minLength="2"
        maxLength="40"
        required
        autoComplete="off"
        onInput={cbFormValidate}
        onBlur={cbFormValidate}
      />
      <span className="dialog-form__input-error input-edit-profile-name-error">
        {inputs?.name?.shouldShowError ? inputs?.name?.error : ""}
      </span>
      <input
        className={inputs?.aboutMe?.shouldShowError ? "dialog-form__input dialog-form__input_type_popup dialog-form__input_invalid"
          : "dialog-form__input dialog-form__input_type_popup"}
        name="aboutMe"
        id="input-edit-profile-about-me"
        type="text" placeholder="О себе"
        value={inputs?.aboutMe?.value || ""}
        minLength="2"
        maxLength="200"
        required
        autoComplete="off"
        onInput={cbFormValidate}
        onBlur={cbFormValidate}
      />
      <span className="dialog-form__input-error input-edit-profile-about-me-error">
        {inputs?.aboutMe?.shouldShowError ? inputs?.aboutMe?.error : ""}
      </span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;