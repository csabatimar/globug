import { ReactNode } from "react";


export interface Credentials {
  paymentCardNumber: string;
  lastName: string;
  token?: string;
}

export interface UserProfile {
  accountBalance: number;
  address: string;
  color: string;
  connectionStatus: string;
  customerReference: string;
  debtBalance: number;
  estimatedRemainingDays: number,
  firstName: string;
  lastName: string;
  lastPayment: number;
  lastPaymentTimestamp: string;
  token?: string;
  fcmToken?: string;
}

export interface Props {
  children?: ReactNode
}

export enum IconFamily { 
  Material = 'Material', 
  MaterialCommunity = 'MaterialCommunity', 
  Entypo = 'Entypo' 
}

export type Nav = {
  navigate: (value: string, value2?: string) => void;
}

export interface DecodedTokenPrpos {
  serviceAccountNumber: string;
  deviceId?: string;
}

export enum PaymentType {
  CREDIT_CARD = 'CCOneOff',
  ACCOUNT_TO_ACCOUNT = 'A2AOneOff',
}

export interface PaymentResponse {
  customerTransactionRef: string;
  gatewayUrl: string;
  transactionId: string;
  status?: number;
  data?: { error: { message: string } }
}

export interface Reminders {
  beforeTomorrow?: boolean;
  today?: boolean;
  balance?: boolean;
  lowerLimitDollars?: number
}