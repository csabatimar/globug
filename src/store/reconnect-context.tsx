import React, { createContext, useState } from "react";
import { Props } from "../interfaces/common-interfaces";


export const ReconnectContext = createContext({
  isReconnectionRequested: false,
  setReconnectionRequested: (toggle: boolean) => {},
});

export default function ReconnectContextProvider({children}: Props) {
  const [isReconnectionRequested, setIsReconnectionRequested] = useState(false);

  function setReconnectionRequested(toggle: boolean) {
    setIsReconnectionRequested(toggle);
  }


  const value = {
    isReconnectionRequested: isReconnectionRequested,
    setReconnectionRequested: setReconnectionRequested
  }

  return (
    <ReconnectContext.Provider value={value}>
    {children}
    </ReconnectContext.Provider>
  );
}