import React from "react";
import PopupWithForm from './PopupWithForm';

function DeletePlacePopup({ card, onCardDelete, ...commonProps }) {
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onCardDelete(card);
  }
  return (
    <PopupWithForm
      title="Вы уверены?"
      name="delete-location"
      onSubmit={handleSubmit}
      {...commonProps}
    />
  );
}

export default DeletePlacePopup;