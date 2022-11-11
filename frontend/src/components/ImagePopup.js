import React from 'react';
function ImagePopup({card, onClose, onBGClick}){ 
  return(
    <div className={`popup popup_type_view-image ${card? 'popup_opened':''}`}>
      <div className="popup__container" onClick={onBGClick}>
        <button className="popup__close-icon" type="button" onClick={onClose}></button>
        <img className="original-image" src={card?.link} alt={`Фотография места ${card?.name}`} />
        <h3 className="image-caption">{card?.name}</h3>
      </div>
    </div>
  );  
}

export default ImagePopup;