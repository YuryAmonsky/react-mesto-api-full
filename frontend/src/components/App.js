import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import { api } from '../utils/Api';
import { register, authorize } from '../utils/Auth';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import BurgerNavBar from './BurgerNavBar';
import Header from './Header';
import Main from './Main';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeletePlacePopup from './DeletePlacePopup';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import Footer from './Footer';


function App() {
  /*isTokenCheckFinished используется для устранения 
  *промаргивания формы входа приоткрытии страницы
  */
  const isTokenCheckFinished = useRef(false);
  /**isUserDataLoaded используется для устанения показа пустого профиля,
   *  пока загружаются данные пользователя 
  */
  const isUserDataLoaded = useRef(false);
  const history = useHistory();
  const [currentUserAccount, setCurrentUserAccount] =
    useState({
      'loggedIn': false,
      'email': ''
    });
  const [currentUser, setCurrentUser] =
    useState({
      'name': '',
      'about': '',
      'avatar': '',
      '_id': '',
      'email': '',
    });

  const [cards, setCards] = useState([]);
  const [regInfo, setRegInfo] = useState({ success: false, message: '' });
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [deletePlaceConfirm, setDeletePlaceConfirm] = useState({ isOpen: false, card: {} });
  const [selectedCard, setSelectedCard] = useState(null);

  /**стейт кнопок сабмита форм
   *  Активность кнопки изменяется при выполнении запросов к серверу и валидации форм.
   * Текст неактивной кнопки разный при выполнении запроса и валидации, 
   * поэтому добавляю в стейт текст отдельным полем.
 */
  const [submitButtonState, setSubmitButtonState] = useState({ text: '', disabled: false });

  const handleRegister = (email, password) => {
    setSubmitButtonState({ text: 'Регистрация', disabled: true });
    register(email, password)
      .then((res) => {
        console.log(`Электронная почта ${res.data.email} зарегистрирована`);
        setRegInfo({ success: true, message: "Вы успешно\n зарегистрировались" });
        setIsInfoTooltipOpen(true);
      })
      .catch((err) => {
        console.log(`${err.status}\nНе удалось зарегистрировать электронную почту ${email}\n Попробуйте ещё раз`);
        setRegInfo({ success: false, message: "Что-то пошло не так!\n Попробуйте еще раз." });
        setIsInfoTooltipOpen(true);
      })
      .finally(() => {
        setSubmitButtonState({ text: 'Зарегистрироваться', disabled: false });
      });
  };
  const handleLogin = (email, password) => {
    setSubmitButtonState({ text: 'Попытка входа', disabled: true });
    authorize(email, password)
      .then(res => {
        localStorage.setItem('jwt', res.token);
        api.setAuthorization(res.token);
        setCurrentUser({ ...res.user });
        //если получен токен, значит указанный email верный и его можно сохранить в стейт
        setCurrentUserAccount({ loggedIn: true, email });
        isUserDataLoaded.current = true;
        isTokenCheckFinished.current = true;
      })
      .catch(err => {
        switch (err.status) {
          case 400:
            console.log('Не передано одно из полей');
            setRegInfo({ success: false, message: 'Не передано одно из полей' });
            break;
          case 401:
            console.log(`Неправильные почта или пароль`);
            setRegInfo({ success: false, message: 'Неправильные почта или пароль' });
            break;
          default:
            console.log('Не удалось войти');            
        }        
        setIsInfoTooltipOpen(true);
      })
      .finally(() => {
        setSubmitButtonState({ text: 'Войти', disabled: false });
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsBurgerOpen(!isBurgerOpen);
    history.push('/sign-in');
    setCurrentUserAccount({ loggedIn: false, email: '' });
    api.setAuthorization('');
    setCurrentUser({
      'name': '',
      'about': '',
      'avatar': '',
      '_id': '',
      'email': '',      
    });
    isUserDataLoaded.current = false;
    isTokenCheckFinished.current = false;
  };
  const handleLoginOpen = useCallback(() => {
    setSubmitButtonState({ text: 'Войти', disabled: true });
  }, []);

  const handleRegisterOpen = useCallback(() => {
    setSubmitButtonState({ text: 'Зарегистрироваться', disabled: true });
  }, []);

  const handleBurgerOpen = () => {
    setIsBurgerOpen(!isBurgerOpen);
    ;
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
    setSubmitButtonState({ text: 'Сохранить', disabled: false });
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
    setSubmitButtonState({ text: 'Сохранить', disabled: true });
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
    setSubmitButtonState({ text: 'Создать', disabled: true });
  };

  const handleDeleteClick = (card) => {
    setDeletePlaceConfirm({ isOpen: true, card: card });
    setSubmitButtonState({ text: 'Да', disabled: false });
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const closeAllPopups = useCallback(() => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setDeletePlaceConfirm({ isOpen: false, card: {} });
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  }, []);

  /*обработчик закрытия попапа по нажатию на фон*/
  const handlePopupBGClick = (evt) => {
    if (evt.target.classList.contains('popup__container')) {
      closeAllPopups();
    }
  };
  /*обработчик закрытия попапа по нажатию Esc*/
  const handleKeyDown = useCallback((evt) => {
    if (evt.key === 'Escape') {
      closeAllPopups();
    }
  }, [closeAllPopups]);

  const handleUpdateUser = (objUserInfo) => {
    setSubmitButtonState({ text: 'Сохранение', disabled: true });
    api.setUserInfo(objUserInfo)
      .then(updatedUser => {
        setCurrentUser(updatedUser.data);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err.status);
        alert(`Ошибка обновления данных пользователя:\n ${err.status}\n ${err.statusText}`)
      })
      .finally(() => {
        setSubmitButtonState({ text: 'Сохранить', disabled: false });
      });
  };
  const handleUpdateAvatar = (link) => {
    setSubmitButtonState({ text: 'Загрузка', disabled: true });
    api.setAvatar(link)
      .then(updatedUser => {
        setCurrentUser(updatedUser.data);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err.status);
        alert(`Ошибка обновления аватара пользователя:\n ${err.status}\n ${err.statusText}`)
      })
      .finally(() => {
        setSubmitButtonState({ text: 'Сохранить', disabled: false });
      });
  };

  const handleAddPlace = (objNewCard) => {
    setSubmitButtonState({ text: 'Добавление', disabled: true });
    api.addNewLocation(objNewCard)
      .then(newCard => {
        console.log(newCard);
        setCards([newCard.data, ...cards]);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err.status);
        alert(`Ошибка добавления карточки:\n ${err.status}\n ${err.statusText}`);
      })
      .finally(() => {
        setSubmitButtonState({ text: 'Создать', disabled: false });
      });
  };

  const handleCardDelete = (card) => {
    setSubmitButtonState({ text: 'Удаление', disabled: true });
    api.deleteLocation(card._id)
      .then(res => {
        console.log(res);
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch(err => {
        console.log(err.status);
        alert(`Ошибка удаления карточки:\n ${err.status}\n ${err.statusText}`);
      })
      .finally(() => {
        setSubmitButtonState({ text: 'Да', disabled: false });
      });
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard.data : c));
      })
      .catch(err => {
        console.log(err.status);
        alert(`Ошибка загрузки данных карточки:\n ${err.status}\n ${err.statusText}`);
      });
  };

  const handleFormValidate = useCallback((isValid, formName) => {

    switch (formName) {
      case 'edit-profile':
        setSubmitButtonState({ disabled: !isValid, text: 'Сохранить' });
        break;
      case 'edit-avatar':
        setSubmitButtonState({ disabled: !isValid, text: 'Сохранить' });
        break;
      case 'new-location':
        setSubmitButtonState({ disabled: !isValid, text: 'Создать' });
        break;
      case 'login':
        setSubmitButtonState({ disabled: !isValid, text: 'Войти' });
        break;
      case 'register':
        setSubmitButtonState({ disabled: !isValid, text: 'Зарегистрироваться' });
        break;
      default:
        break;
    }
  }, []);


  /**получение данных пользователя, загрузка карточек, проверка jwt */
  useEffect(() => {
    /*const checkLoggedIn = () => {
      isTokenCheckFinished.current = false;
      if (localStorage.getItem('jwt')) {
        const jwt = localStorage.getItem('jwt');
        console.log(jwt);
        validateToken(jwt)
          .then(res => {           
              setCurrentUserAccount({ loggedIn: true, email: res.data.email });
              api._headers.authorization = `Bearer ${jwt}`;            
          })
          .catch(err => {
            switch (err.statusCode) {
              case 400:
                console.log('Токен не передан или передан не в том формате');
                break;
              case 401:
                console.log('Переданный токен некорректен');
                break;
              default:
                console.log('Не удалось проверить токен');
                setCurrentUserAccount({ loggedIn: false, email: '' });
            };
          })
          .finally(() => {
            isTokenCheckFinished.current = true;
          });
      } else {
        isTokenCheckFinished.current = true;
      }
    };*/
    //if (currentUserAccount.loggedIn) {
      //checkLoggedIn();
      
    //} else {
      if (localStorage.getItem('jwt')) {
        const jwt = localStorage.getItem('jwt');
        api.setAuthorization(jwt);

        Promise.all([
          api.getUserInfo(),
          api.loadLocations()
        ])
          .then((values) => {
            setCurrentUser({ ...values[0].data });            
            setCards([...values[1].data]);
            setCurrentUserAccount({ loggedIn: true, email: values[0].data.email });
          }).catch(err => {
            console.log(err);
            alert(`Ошибка загрузки данных:\n ${err.status}\n ${err.statusText}`);
          })
          .finally(() => {
            isTokenCheckFinished.current = true;
            isUserDataLoaded.current = true;
          });
      }else{
        api.setAuthorization('');
        isTokenCheckFinished.current = true;
      }
    //}
  }, []);

  useEffect(() => {
    if (currentUserAccount.loggedIn) {
      api.loadLocations()
        .then((cards) => {
          setCards([...cards.data]);
          history.push('/');
        })
        .catch((err) => {
          console.log(err);
          alert(`Ошибка загрузки данных:\n ${err.status}\n ${err.statusText}`);
        });

    }  
    //else history.push('/sign-in');
  }, [currentUserAccount, history]);

  useEffect(() => {
    if (!isInfoTooltipOpen)
      setTimeout(() => {
        setRegInfo({ success: false, message: '' });
      }, 500);

  }, [isInfoTooltipOpen]);

  useEffect(() => {
    if (regInfo.success) {
      history.push('/sign-in');
    }
  }, [regInfo.success, history]);

  useEffect(() => {
    if (isInfoTooltipOpen || isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || deletePlaceConfirm.isOpen || selectedCard) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isInfoTooltipOpen, isEditAvatarPopupOpen, isEditProfilePopupOpen, isAddPlacePopupOpen, deletePlaceConfirm.isOpen, selectedCard, handleKeyDown]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Switch>
          <Route path="/sign-in" >
            <Header isBurgerOpen={isBurgerOpen}>
              <nav className="nav-bar">
                <Link to="/sign-up" className="nav-bar__link">
                  Регистрация
                </Link>
              </nav>
            </Header>
            <Login
              name="login"
              title="Вход"
              onOpen={handleLoginOpen}
              onSubmit={handleLogin}
              onFormValidate={handleFormValidate}
              buttonState={submitButtonState}
            />
          </Route>
          <Route path="/sign-up">
            <Header isBurgerOpen={isBurgerOpen}>
              <nav className="nav-bar">
                <Link to="/sign-in" className="nav-bar__link">
                  Войти
                </Link>
              </nav>
            </Header>
            <Register
              name="register"
              title="Регистрация"
              onOpen={handleRegisterOpen}
              onSubmit={handleRegister}
              onFormValidate={handleFormValidate}
              buttonState={submitButtonState}
            >
              <Link to="/sign-in" className="dialog-form__link">
                Войти
              </Link>
            </Register>
          </Route>
          {isTokenCheckFinished.current ?
            <>
              <ProtectedRoute exact path="/" loggedIn={currentUserAccount.loggedIn}>
                <BurgerNavBar
                  isBurgerOpen={isBurgerOpen}
                  userEmail={currentUserAccount.email}
                  onButtonClick={handleLogout}>
                </BurgerNavBar>
                <Header >
                  <nav className="nav-bar">
                    <p className="nav-bar__user-name nav-bar__user-name_low-res-hidden">{currentUserAccount.email}</p>
                    <button className="nav-bar__button nav-bar__button_low-res-hidden" onClick={handleLogout} type="button">
                      Выйти
                    </button>
                    <button className={`burger-button ${isBurgerOpen ? "burger-button_is-open" : ""}`} onClick={handleBurgerOpen} type="button"></button>
                  </nav>
                </Header>
                {isUserDataLoaded.current ?
                  <>
                    <Main
                      cards={cards}
                      onEditProfile={handleEditProfileClick}
                      onEditAvatar={handleEditAvatarClick}
                      onNewLocation={handleAddPlaceClick}
                      onCardClick={handleCardClick}
                      onCardLike={handleCardLike}
                      onDeleteClick={handleDeleteClick}
                    />
                  </> :
                  <></>
                }
                <Footer />
              </ProtectedRoute>
            </> :
            <></>
          }
        </Switch>
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          success={regInfo.success}
          message={regInfo.message}
          onClose={closeAllPopups}
          onBGClick={handlePopupBGClick}
          onKeyDown={handleKeyDown}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onBGClick={handlePopupBGClick}
          onKeyDown={handleKeyDown}
          onUpdateUser={handleUpdateUser}
          onFormValidate={handleFormValidate}
          buttonState={submitButtonState}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onBGClick={handlePopupBGClick}
          onKeyDown={handleKeyDown}
          onUpdateAvatar={handleUpdateAvatar}
          onFormValidate={handleFormValidate}
          buttonState={submitButtonState}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onBGClick={handlePopupBGClick}
          onKeyDown={handleKeyDown}
          onAddPlace={handleAddPlace}
          onFormValidate={handleFormValidate}
          buttonState={submitButtonState}
        />
        <DeletePlacePopup
          isOpen={deletePlaceConfirm.isOpen}
          onClose={closeAllPopups}
          onBGClick={handlePopupBGClick}
          onKeyDown={handleKeyDown}
          card={deletePlaceConfirm.card}
          onCardDelete={handleCardDelete}
          buttonState={submitButtonState}
        />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          onBGClick={handlePopupBGClick}
          onKeyDown={handleKeyDown}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;