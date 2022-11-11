import { useEffect } from "react";
import PopupWithForm from './PopupWithForm';
import useFormValidator from "../hooks/useFormValidator";

function AddPlacePopup({ isOpen, onAddPlace, onFormValidate, ...commonProps }) {  
  const { inputs, setInputs, cbResetValidator, cbFormValidate } = useFormValidator('new-location', onFormValidate);
  
  const handleAddPlaceSubmit = (evt) => {
    evt.preventDefault();
    onAddPlace({ name: inputs?.name.value, link: inputs?.link.value });
  }

  /**Инициализация инпутов при закрытии попапа*/
  useEffect(() => {
    if (!isOpen) {      
      setInputs(
        {
          name: 
          {
            value: '',
            valid: false,
            error: '',
            shouldShowError: false
          },
          link:
          {
            value: '',
            valid: false,
            error: '',
            shouldShowError: false
          }
        }
      );
    } else {
      cbResetValidator(isOpen, false);
    }
  }, [isOpen, setInputs, cbResetValidator]);

  return (
    <PopupWithForm
      title="Новое место"
      name="new-location"
      id="new-location"
      isOpen={isOpen}
      onSubmit={handleAddPlaceSubmit}
      {...commonProps}
    >
      <input
        className={inputs?.name?.shouldShowError ? "dialog-form__input dialog-form__input_type_popup dialog-form__input_invalid"
          : "dialog-form__input dialog-form__input_type_popup"}
        name="name"
        id="input-new-location-name"
        type="text"
        placeholder="Название"
        value={inputs?.name?.value || ""}
        minLength="2"
        maxLength="30"
        required
        autoComplete="off"
        onInput={cbFormValidate}
        onBlur={cbFormValidate}
      />
      <span
        className="dialog-form__input-error"
      >
        {inputs?.name?.shouldShowError ? inputs.name?.error : ""}
      </span>
      <input
        className={inputs?.link?.shouldShowError ? "dialog-form__input dialog-form__input_type_popup dialog-form__input_invalid"
          : "dialog-form__input dialog-form__input_type_popup"}
        name="link"
        id="input-new-location-link"
        type="url"
        placeholder="Ссылка на картинку"
        value={inputs?.link?.value || ""}
        required
        autoComplete="off"
        onInput={cbFormValidate}
        onBlur={cbFormValidate}
      />
      <span
        className="dialog-form__input-error"
      >
        {inputs?.link?.shouldShowError ? inputs?.link?.error : ""}
      </span>
    </PopupWithForm>
  );

}

export default AddPlacePopup;