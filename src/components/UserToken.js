import { useState } from 'react'

function UserToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) return null;
    try {
      const parsed = JSON.parse(tokenString);
      return parsed?.token ?? parsed;
    } catch (e) {
      return tokenString;
    }
  };
  const [token, setToken] = useState(getToken());
  const saveToken = (userToken) => {
    if (typeof userToken === 'string') {
      localStorage.setItem('token', userToken);
      setToken(userToken);
    } else {
      localStorage.setItem('token', JSON.stringify(userToken));
      setToken(userToken?.token ?? userToken);
    }
  };
  return {
    setToken: saveToken,
    token,
  };
}

export default UserToken
