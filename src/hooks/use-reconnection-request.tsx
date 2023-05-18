import moment from "moment";
import { useContext } from "react";
import { Alert } from "react-native";
import { requestReconnection } from "../api/globug-api";
import encryptedStorage from "../store/encrypted-storage";
import { ReconnectContext } from "../store/reconnect-context";


export default function useReconnectionRequest() {
  const {setReconnectionRequested} = useContext(ReconnectContext);

  async function fetchReconnectTimeStamp() {
    const result = await encryptedStorage.getValueFor('RECONNECT_STATE');
    if (result && result.buttonPressed + 1800 > moment().unix()) {
      console.debug(
        'reconnection buton disabled state expires in: ',(result.buttonPressed + 1800)-(moment().unix())
      );
      setReconnectionRequested(true);
    }
    if (result && result.buttonPressed + 1800 < moment().unix()) {
      setReconnectionRequested(false);
      encryptedStorage.removeValueFor('RECONNECT_STATE');
    }
  }

  async function requestReconnectionAndSaveToDevice(serviceAccountNumber: string) {
    const result = await requestReconnection(serviceAccountNumber);
    if(result.saveResultType === "SUCCESSFUL") {
      setReconnectionRequested(true);
      encryptedStorage.save('RECONNECT_STATE',{buttonPressed: moment().unix()});
      // TODO: Replace Alert with Modal
      Alert.alert(
        'Request Submitted!',
        'Please allow up to two hours for your property to be reconnected.', 
        [{ text: 'OK', style: 'cancel' }]
      );
    }
    else {
      Alert.alert(
        'Reconnect Request failed!',
        'Please call 0800 773 729, click OK to continue.', 
        [{ text: 'OK', style: 'cancel' }]
      );
    }
  }

  return {
    requestReconnectionAndSaveToDevice,
    fetchReconnectTimeStamp
  }
}