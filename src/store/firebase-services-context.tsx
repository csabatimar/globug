import React, { createContext, useState } from "react";
import { Props } from "../interfaces/common-interfaces";


interface FireBaseServicesStateType {
  maintenanceMode: {
    id: number;
    type: string;
    enabled: boolean;
    message: string;
  };
  fcmToken: string;
}

export const FirebaseServicesContext = createContext({
  fireBaseServicesState: {} as FireBaseServicesStateType,
  updateFireBaseServicesProfile: (
    key: keyof FireBaseServicesStateType,
    value: FireBaseServicesStateType[keyof FireBaseServicesStateType]
  ) => {},
  clearFirebaseServicesProfile: () => {}
});

export default function FirebaseServicesContextProvider({ children }: Props) {
  const [fireBaseServicesState, setFireBaseServicesState] = useState({
    maintenanceMode: {
      id: 0,
      type: '',
      enabled: false,
      message: '',
    },
    fcmToken: ''
  });

  function updateFireBaseServicesProfile(
    key: keyof FireBaseServicesStateType, 
    value: FireBaseServicesStateType[keyof FireBaseServicesStateType]
  ) {
    console.debug(`Updating Firebase Services Profile: '${key}' : `, value);
    setFireBaseServicesState(prevState => ({...prevState, [key]: value }));
  }

  const value = {
    fireBaseServicesState: fireBaseServicesState,
    updateFireBaseServicesProfile: updateFireBaseServicesProfile,
  }

  return (
    // @ts-ignore
    <FirebaseServicesContext.Provider value={value}>
      {children}
    </FirebaseServicesContext.Provider>
  );
}