import EncryptedStorage from 'react-native-encrypted-storage';


async function save(key: string, value: string | object) {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
  } 
  catch(error) {
    console.log(`Error saving ${key}: ${value}`, error);
  }
}

async function getValueFor(key: string) {
  try {
    const value = await EncryptedStorage.getItem(key);
    if(value !== undefined) {
      return JSON.parse(value!);
    }
  } 
  catch(error) {
    console.log(`Error getting value for ${key}`, error);
  }
}

async function removeValueFor(key: string) {
  try {
    await EncryptedStorage.removeItem(key);
  } 
  catch(error) {
    console.log(`Error removing value for ${key}`, error);
  }
}

async function clearStorage() {
  try {
    await EncryptedStorage.clear();
  } 
  catch(error) {
    console.log(`Error clearing device storage`, error);
  }
}

export default { save, getValueFor, removeValueFor, clearStorage };