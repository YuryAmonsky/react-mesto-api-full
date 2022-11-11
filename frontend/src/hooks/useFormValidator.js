/** Валидация формы происходит по схеме:
 * Пока вводим текст в поле просто проверяем валидный инпут или нет, но не показываем ошибку.
 * Если инпут не валидный делаем кнопку неактивной, ошибку не показываем.
 * Ошибку показываем при потере инпутом фокуса или отсутствии ввода в течение 5 секунд.
 * в onFormValidate из App.js проверяется все ли инпуты валидны и в соответсвии с этим меняется состояние кнопки сабмита.
*/
import { useCallback, useEffect, useRef, useState } from "react";

const useFormValidator = (formName, cbToggleButton) => {
  const isFormOpen = useRef(false);
  /**isInitialState используется, 
   * для срабатывания эффектов только в определенных ситуациях*/
  const isInitialState = useRef(true);
  const currentInputName = useRef();
  const timer = useRef(0);
  const wasInputEvent = useRef(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [inputs, setInputs] = useState({});

  const cbFormValidate = (evt) => {
    currentInputName.current = evt.target.name;
    const value = evt.target.value;
    const isInputValid = evt.target.validity.valid;
    const error = evt.target.validationMessage;
    const input = inputs[currentInputName.current];
    if (evt.type === 'input') {
      if (isInitialState.current) isInitialState.current = false;
      wasInputEvent.current = true;
      const shouldShow = input ? input.shouldShowError && !isInputValid : false;
      setInputs({
        ...inputs,
        [currentInputName.current]: {
          value,
          valid: isInputValid,
          error: error,
          shouldShowError: shouldShow
        }
      });
    }
    if (evt.type === 'blur') {
      clearTimeout(timer.current);
      wasInputEvent.current = false;
      setInputs({
        ...inputs,
        [currentInputName.current]: {
          value,
          valid: isInputValid,
          error: error,
          shouldShowError: !isInputValid
        }
      });
    }
  };
  const getFormInputsState = useCallback((shouldShowError) => {
    const formElements = Array.from(document.forms.namedItem(formName).elements);
    const items = formElements.filter(element => ['text', 'url', 'password', 'email'].includes(element.type));
    return items.reduce((obj, input) =>
      ({ ...obj, [input.name]: { value: input.value, valid: input.validity.valid, error: input.validationMessage, shouldShowError: shouldShowError } }),
      {});
  }, [formName]);

  const cbResetValidator = useCallback((isOpen, isValid) => {
    isFormOpen.current = isOpen;
    isInitialState.current = true;
    setIsFormValid(isValid);
    setInputs({ ...getFormInputsState(!isInitialState.current) });
  }, [getFormInputsState]);

  /**показ ошибки при отсутствии ввода в инпут текстового типа в течение 5сек 
   * после предыдущего ввода в случае невалидного значения инпута
  */
  useEffect(() => {
    const cbCheckInputCompletion = (inputName) => {
      const input = inputs[inputName];
      const shouldShow = input ? !input.valid : true;
      setInputs({
        ...inputs,
        [inputName]:
        {
          ...input,
          shouldShowError: shouldShow
        }
      });
    }
    if (isFormOpen.current && !isInitialState.current) {
      clearTimeout(timer.current);
      if (wasInputEvent.current) {
        wasInputEvent.current = false;
        timer.current = setTimeout(() => { cbCheckInputCompletion(currentInputName.current) }, 5000);
      }
      const items = Object.values(inputs);
      const isValid = items.every((input) => { return input.valid; });
      //const inputs = Array.from(form.elements);
      //const isValid = inputs.every((input) => { return input.validity? input.validity.valid: true; });
      //const isValid = inputs.every((input) => { 
      //  console.log(`${input.name} ${input.validity.valid}`);
      //  return input.checkValidity(); });
      setIsFormValid(isValid);
    }
  }, [inputs]);

  useEffect(() => {
    cbToggleButton(isFormValid, formName);
  }, [isFormValid, formName, cbToggleButton]);

  return { inputs, setInputs, cbResetValidator, cbFormValidate };
}

export default useFormValidator;