import axios from "axios";
import jwtDecode from "jwt-decode";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import { getPersistentCredentials } from "../helpers/utils";
import { DecodedTokenPrpos, Reminders } from "../interfaces/common-interfaces";


export async function putReminders(reminders: Reminders, fcmToken: string) {
  const {paymentCardNumber, token} = await getPersistentCredentials();
  const { serviceAccountNumber }: DecodedTokenPrpos = jwtDecode(token);
  const deviceId = `${DeviceInfo.getBrand()}_${DeviceInfo.getDeviceId()}`;

  try {
    const response = await axios.put(
      `/service-accounts/${serviceAccountNumber}/reminders`,
      {
        metadata: {
          device: deviceId,
        },
        reminders: {
          'lowbal.disco.today.enabled': reminders.today,
          'lowbal.disco.tomorrow.enabled': reminders.beforeTomorrow,
          'creditbal.enabled': reminders.balance,
          'creditbal.threshold': reminders.lowerLimitDollars,
        }
      },
      {
        baseURL: Config.GLOBUG_API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
          notificationToken: fcmToken,
        },
        params: {
          paymentCardNumber: paymentCardNumber,
        },
      },
    );

    return response;
  } 
  catch (error) {
    return error;
  }
}