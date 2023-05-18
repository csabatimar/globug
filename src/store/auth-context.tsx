import React, { createContext, useState } from "react";
import { Props } from "../interfaces/common-interfaces";


export const AuthContext = createContext({
  authToken: '',
  isAuthenticated: false,
  authenticate: (authToken: string) => {},
  logout: () => {}
});

export default function AuthContextProvider({children}: Props) {
  const [accessToken, setAccessToken] = useState('');

  function authenticate(authToken: string) {
    setAccessToken(authToken);
  }

  function logout() {
    setAccessToken('');
  }

  const value = {
    authToken: accessToken,
    isAuthenticated: !!accessToken,
    authenticate: authenticate,
    logout: logout
  }

  return (
    <AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>
  );
}