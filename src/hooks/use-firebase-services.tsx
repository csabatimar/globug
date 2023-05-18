import { useContext, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import remoteConfig from '@react-native-firebase/remote-config';
import { FirebaseServicesContext } from '../store/firebase-services-context';


export default function useFirebaseServices() {
  const firebaseServicesCtx = useContext(FirebaseServicesContext);

  // Requesting user permissions first to display notifications
  //  (used by Firebase Remote Config under the hood)

  async function requestUserPermission() {
    try {
      const authStatus = await messaging().requestPermission();

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        firebaseServicesCtx.updateFireBaseServicesProfile(
          'fcmToken', await messaging().getToken()
        );
      } else {
        console.debug(
          'Could not get a Firebase token - auth error: ',
          authStatus,
        );
      }
    } catch (error) {
      console.debug(`Request User Permission ${error}`);
    }
  }

  useEffect(() => {
    if (firebaseServicesCtx.fireBaseServicesState.fcmToken. length > 1) {
      fetchAndSubscribe();
    }
  }, [firebaseServicesCtx.fireBaseServicesState.fcmToken]);

  const remoteConfigDefaults = {
    maintenance_mode: JSON.stringify(
      firebaseServicesCtx.fireBaseServicesState.maintenanceMode
    ),
  };

  async function fetchRemoteConfig() {
    try {
      await remoteConfig().setConfigSettings({
        minimumFetchIntervalMillis: 30000,
        fetchTimeMillis: 30000,
      });

      await remoteConfig().fetchAndActivate();
    } catch (error) {
      console.debug(`Fetch Remote Config ${error}`);
    }
  }

  async function syncConfig() {
    try {
      const result = await remoteConfig().getValue(
        'maintenance_mode'
      ).asString();
      if (result !== JSON.stringify(
        firebaseServicesCtx.fireBaseServicesState.maintenanceMode
      )) {
        firebaseServicesCtx.updateFireBaseServicesProfile(
          'maintenanceMode', JSON.parse(result)
        )
      }
    } catch (error) {
      console.debug(`Syncing Local and Remote Configs ${error}`);
    }
  }

  async function fetchAndSubscribe() {
    try {
      await remoteConfig().setDefaults(remoteConfigDefaults);

      await fetchRemoteConfig();

      await syncConfig();

      await messaging().subscribeToTopic('PUSH_RC');

      await messaging().onMessage(async remoteMessage => {
        if (remoteMessage.data!.CONFIG_STATE === 'STALE') {
          // trycatch fails here when throttling 
          // (see Firebase Remote Config throttling)
          await remoteConfig().fetchAndActivate();
          await syncConfig();
        }
      });
    } catch (error) {
      console.debug(`Fetch and Subscribe ${error}`);
    }
  }

  return requestUserPermission;
}