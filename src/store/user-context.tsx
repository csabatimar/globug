import React, { createContext, useState } from 'react';
import { Props, UserProfile } from '../interfaces/common-interfaces';


export const UserContext = createContext({
  userProfile: {} as UserProfile,
  setUserProfile: (userProfile: UserProfile) => {},
  updateUserProfile: (key: keyof UserProfile, value: UserProfile[keyof UserProfile]) => {},
  clearUserProfile: () => {}
});

export default function UserContextProvider({children}: Props) {
  const [userProfileState, setUserProfileState] = useState({} as UserProfile);

  function setUserProfile(userProfile: UserProfile) {
    console.debug('User Profile: ', JSON.stringify(userProfile, null, 2));
    setUserProfileState(prevState => ({...prevState, ...userProfile}));
  }

  function updateUserProfile(key: keyof UserProfile, value: UserProfile[keyof UserProfile]) {
    console.debug(`Updating User Profile: '${key}' : '${value}'`);
    setUserProfileState(prevState => ({...prevState, [key]: value }));
  }

  function clearUserProfile() {
    setUserProfileState({} as UserProfile);
  }

  const value = {
    userProfile: userProfileState,
    setUserProfile: setUserProfile,
    updateUserProfile: updateUserProfile,
    clearUserProfile: clearUserProfile
  }

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}