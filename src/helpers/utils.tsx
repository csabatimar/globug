import { Credentials, UserProfile } from "../interfaces/common-interfaces";
import numeral from 'numeral';
import SInfo from "react-native-sensitive-info";
import { Platform, StatusBar } from "react-native";


export function capitaliseFirstLetter (string: string) {
  return (string.length > 0) ? 
    string[0].toUpperCase() + string.substring(1) : '';
}
  
export function capitaliseWords(sentence: string) {
  return sentence.split(' ').map(
    (word) => capitaliseFirstLetter(word)).join(' ');
}

export function displayName(userProfile: UserProfile) {
  const { firstName = '', lastName = '' } = userProfile;
  const fullName = [firstName, lastName].join(' ');
  return capitaliseWords(fullName);
};

export function displayDate(datetimestamp: string) {
  if (datetimestamp) {
    const [date] = datetimestamp.split(' ');
    return date;
  } else {
    return null;
  }
}

export function removeSpaces(string: string) {
  return string.replace(/\s+/g, '');
}

export function formatBalance(balance: number) {
  return numeral(balance).format('0.00');
}

export function formatBalanceForBar(balance: number) {
  return balance < 100 ? formatBalance(balance) : numeral(balance).format('0');
}

export const setPersistentCredentials = async (credentials: Credentials) => {
  if (credentials) {
    await SInfo.setItem('credentials', JSON.stringify(credentials), {});
  } else {
    //TODO create a clear deletion method appart from here to avoid issues
    await SInfo.deleteItem('credentials', {});
  }
};

export const getPersistentCredentials = async () => {
  const storedItem = await SInfo.getItem('credentials', {});
  return storedItem && JSON.parse(storedItem);
};

export function setStatusBarStyle(color: string) {
  StatusBar.setBarStyle('dark-content');
  (Platform.OS === 'android') && StatusBar.setBackgroundColor(color);
}

export function compareObjectValues<T extends Record<string, unknown>>(
  originalObject: T, modifiedObject: T
) {  
  const resultObject: Partial<T> = {};

  for (const key in modifiedObject) {
    if (originalObject[key] !== modifiedObject[key]) {
      resultObject[key] = modifiedObject[key];
    }
  }
  return resultObject;
}