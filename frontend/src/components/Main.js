import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';

function Main({ cards, onEditProfile, onEditAvatar, onNewLocation, onCardClick, onCardLike, onDeleteClick}) {

  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-container" onClick={onEditAvatar}>
          <img className="profile__avatar" src={currentUser.avatar} alt="аватар" />
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button className="profile__edit-button" type="button" onClick={onEditProfile}></button>
          <p className="profile__about-me">{currentUser.about}</p>
        </div>
        <button className="profile__add-button" type="button" onClick={onNewLocation}></button>
      </section>
      <section aria-label="locations">
        <ul className="location-list">
          {
            cards.map((card) =>
              <Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onDeleteClick={onDeleteClick} />
            )
          }
        </ul>
      </section>
    </main>
  );
}

export default Main;