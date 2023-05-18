import axios from 'axios';
import Config from "react-native-config";
import DeviceInfo from 'react-native-device-info';
import jwtDecode from 'jwt-decode';
import * as DateFNs from 'date-fns';
import { getPersistentCredentials, setPersistentCredentials } from '../helpers/utils';
import { 
  Credentials, DecodedTokenPrpos, PaymentResponse, PaymentType 
} from '../interfaces/common-interfaces';


interface ConsumptionHistoryProps {
  token: string;
  startDate: Date;
  endDate: Date;
  frequency: string
}

interface PaymentRedirectUrls {
  success: string;
  failure: string;
}

interface PaymentRequest {
  amount: number;
  paymentType: PaymentType;
  channel: string;
  accountReference: string;
  redirectUrls: PaymentRedirectUrls;
}

interface ReconnectRequest {
  requestType: string;
}

const publicApi = axios.create({
  baseURL: Config.GLOBUG_API_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
  },
});

export async function login({ paymentCardNumber, lastName }: Credentials) {
  try {
    const deviceId = await DeviceInfo.getUniqueId();
    const response = await publicApi.post('/login',
      {
        grant_type: 'password',
        paymentCardNumber: paymentCardNumber,
        lastName: lastName,
        deviceId: deviceId,
      }
    );

    if (response.data) {
      await setPersistentCredentials({
        paymentCardNumber: paymentCardNumber,
        lastName: lastName,
        token: response.data.access_token,
      });

      return response.data;
    }
  }
  catch (error) {
    return error;
  }
}

const privateApi = axios.create({
  baseURL: Config.GLOBUG_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

privateApi.interceptors.request.use(async (config) => {
  try {
    const { token } = await getPersistentCredentials();
    config.headers = { ...config.headers, Authorization: token };
    return config;
  }
  catch (error) {
    throw new Error(`Axios Error: ${error}`);
  }
});

privateApi.interceptors.response.use((response) => response, async (error) => {
  const unauthorised =
    error.response && error.response.status && error.response.status === 401;
  const originalRequest = error.config;
  if (unauthorised && !originalRequest._retry) {
    let paymentCardNumber;
    let lastName;
    try {
      const credentials = await getPersistentCredentials();
      paymentCardNumber = credentials.paymentCardNumber;
      lastName = credentials.lastName;
    } catch (e) {
      return Promise.reject(error);
    }
    await login({ paymentCardNumber, lastName });
    originalRequest._retry = true;
    return privateApi(originalRequest);
  } 
  else {
    return Promise.reject(error.response);
  }
},
);

export async function getUserProfile(token: string) {
  const { serviceAccountNumber }: DecodedTokenPrpos = jwtDecode(token);
  try {
  const response = await privateApi.get(
    `/service-accounts/${serviceAccountNumber}`,
  );
  return response.data;
  }
  catch (error) {
    return error;
  }
}

export async function getConsumptionHistory(
  { token, startDate, endDate, frequency }: ConsumptionHistoryProps
) {
  try {
    const { serviceAccountNumber }: DecodedTokenPrpos = jwtDecode(token);
    const DATE_FORMAT = 'yyyyMMdd';
    const response = await privateApi.get(
      `/service-accounts/${serviceAccountNumber}/consumption-history`, {
        params: {
          start_date: DateFNs.format(startDate, DATE_FORMAT),
          end_date: DateFNs.format(endDate, DATE_FORMAT),
          frequency,
        },
    });
    return {
      transactions: response.data.transactions,
      caps: 'caps' in response.data ? response.data.caps : undefined
    }
  }
  catch(error) {
    return error;
  }
}

export async function createPayment(paymentRequest: PaymentRequest) {
  let path = '';

  if (paymentRequest && paymentRequest.paymentType && paymentRequest.accountReference) {
    const serviceAccountNumber = paymentRequest.accountReference;
    if (paymentRequest.paymentType === PaymentType.CREDIT_CARD) {
      path = `/service-accounts/${serviceAccountNumber}/payments/oneoff/credit-card`;
    }
    else {
      path = `/service-accounts/${serviceAccountNumber}/payments/oneoff/a2a`;
    }

    try {
      const response = await privateApi.post(path, paymentRequest);
      if (response && response.status > 399) {
        throw new Error(`Error creating a payment: ${response}`);
      }
      else {
        return response.data;
      }
    }
    catch(e) {
      return e;
    }

  }
  else {
    throw new Error('Malformed request');
  }
}

export async function updatePayment(paymentRequest: PaymentRequest,paymentResponse: PaymentResponse) {
  let path = '';

  if (paymentRequest && paymentRequest.paymentType && paymentRequest.accountReference) {
    const serviceAccountNumber = paymentRequest.accountReference;
    const transactionId = paymentResponse.transactionId;
    if (paymentRequest.paymentType === PaymentType.CREDIT_CARD) {
      path = `/service-accounts/${serviceAccountNumber}/payments/oneoff/credit-card/${transactionId}`;
    }
    else {
      path = `/service-accounts/${serviceAccountNumber}/payments/oneoff/a2a/${transactionId}`;
    }

    const updateRequest = {
      paymentType: paymentRequest.paymentType,
      accountReference: paymentRequest.accountReference,
      channel: paymentRequest.channel,
      customerTransactionRef: paymentResponse.customerTransactionRef,
      transactionId: paymentResponse.transactionId
    }

    try {
      const response = await privateApi.put(path, updateRequest);
      if (response && response.status > 399) {
        throw new Error(`Error updating the payment: ${response}`);
      }
      else {
        return response.data;
      }
    }
    catch(e) {
      console.error('updatePayment Error: ', e);
      return e;
    }

  }
  else {
    throw new Error('Malformed request');
  }
}

export async function requestReconnection(serviceAccountNumber: string) {
  const path = `/service-accounts/${serviceAccountNumber}/reconnect`;
  const request: ReconnectRequest = {requestType: 'reconnect'};

  try {
    const response = await privateApi.post(path, request);
    if (response && response.status > 399) {
      throw new Error(`Error reconnection requesting: ${response}`);
    }
    else {
      return response.data;
    }
  } 
  catch (error) {
    return error;
  }
}