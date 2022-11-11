import { useRef, useEffect } from "react";
import PopupWithForm from './PopupWithForm';
import useFormValidator from "../hooks/useFormValidator";

function EditAvatarPopup({ isOpen, onUpdateAvatar, onFormValidate, ...commonProps }) {
  const avatarLink = useRef();
  const { inputs, cbResetValidator, cbFormValidate } = useFormValidator('edit-avatar', onFormValidate);
  
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onUpdateAvatar(avatarLink.current.value);
  }

  /**Инициализация инпутов при закрытии попапа значениями из currentUser */
  useEffect(() => {
    if (!isOpen) {
      avatarLink.current.value = '';
    } else {
      cbResetValidator(isOpen, false);
    }
  }, [isOpen, cbResetValidator]);

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="edit-avatar"
      id="edit-avatar"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      {...commonProps}
    >
      <input
        ref={avatarLink}
        className={inputs?.avatar?.shouldShowError ? "dialog-form__input dialog-form__input_type_popup dialog-form__input_invalid"
          : "dialog-form__input dialog-form__input_type_popup"}
        name="avatar"
        id="input-edit-avatar"
        type="url"
        placeholder="Ссылка на картинку"
        required
        autoComplete="off"
        onInput={cbFormValidate}
        onBlur={cbFormValidate}
      />
      <span
        className="dialog-form__input-error input-edit-avatar-error"
      >
        {inputs?.avatar?.shouldShowError ? inputs?.avatar?.error : ""}
      </span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;