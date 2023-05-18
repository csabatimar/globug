import React, { useContext } from 'react';
import { getUserProfile } from '../api/globug-api';
import { compareObjectValues } from '../helpers/utils';
import { UserProfile } from '../interfaces/common-interfaces';
import { AuthContext } from '../store/auth-context';
import { ConsumptionContext } from '../store/consumption-context';
import { UserContext } from '../store/user-context';
import { dailyConsumption, monthlyConsumption, weeklyConsumption } from '../helpers/fetch-consumption-utils';
import EncryptedStorage from '../store/encrypted-storage';


export default function useAppServices() {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const consumptionCtx = useContext(ConsumptionContext);

  async function setUserProfileStore() {
    if(typeof userCtx.userProfile.customerReference === 'undefined') {
      userCtx.setUserProfile(await getUserProfile(authCtx.authToken));
      userCtx.updateUserProfile('token', authCtx.authToken);
    }
  }
  
  async function setConsumptionStore() {
    if(consumptionCtx.dailyConsumption.length < 1) {
      consumptionCtx.setDailyConsumption(await dailyConsumption(authCtx.authToken));
      consumptionCtx.setWeeklyConsumption(await weeklyConsumption(authCtx.authToken));
      consumptionCtx.setMonthlyConsumption(await monthlyConsumption(authCtx.authToken));
    }
  }
  
  async function refreshUserProfile() {
    console.debug('refreshing user profile...');

    const remoteUserState = await getUserProfile(authCtx.authToken);
    const localUserState = userCtx.userProfile;
    const difference = compareObjectValues(localUserState, remoteUserState);

    for (const key in difference){
      const typedKey = key as keyof UserProfile;
      const value = difference[key];
      userCtx.updateUserProfile(typedKey, value);
    }
  }
  
  async function logout() {
    const retrievedCredentials = await EncryptedStorage.getValueFor('CREDENTIALS');
    await EncryptedStorage.save('CREDENTIALS', {...retrievedCredentials, accessToken: null});
    await authCtx.logout();
    await userCtx.clearUserProfile();
    await consumptionCtx.clearAllConsumption();
  }

  return {
    setUserProfileStore,
    setConsumptionStore,
    refreshUserProfile,
    logout
  }
}