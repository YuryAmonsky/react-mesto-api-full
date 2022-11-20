class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
    
  }
  setAuthorization(token){
    this._headers['authorization'] = `Bearer ${token}`;
  }

  _checkServerResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._headers
    })
      .then(this._checkServerResponse);
  }

  setUserInfo(objUserInfo) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(objUserInfo)
    })
      .then(this._checkServerResponse);
  }

  setAvatar(link) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ "avatar": link })
    })
      .then(this._checkServerResponse);
  }

  loadLocations() {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: this._headers
    })
      .then(this._checkServerResponse);
  }

  addNewLocation(objNewCardData) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(objNewCardData)
    })
      .then(this._checkServerResponse);
  }
  deleteLocation(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers
    })
      .then(this._checkServerResponse);
  }

  setLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers
    })
      .then(this._checkServerResponse);
  }

  deleteLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers
    })
      .then(this._checkServerResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return this.setLike(cardId);
    } else {
      return this.deleteLike(cardId);
    }
  }
}

export const api = new Api({
  baseUrl: 'https://api.amo.edu.nomoredomains.club',
  headers: {
    authorization: '',
    'Content-Type': 'application/json'
  }
});