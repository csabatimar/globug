import { Alert } from 'react-native';
import EncryptedStorage from '../store/encrypted-storage';


export default function useNotice() {
  async function fetchNoticeId() {
    try {
      const noticeId = await EncryptedStorage.getValueFor('NOTICE');
      return noticeId;
    } catch (error) {
      console.debug(`error fetching notice id from the device storage ${error}`);
    }
  }

  async function saveNoticeId(id: number) {
    const noticeId = { noticeId: id };
    await EncryptedStorage.save('NOTICE', noticeId);
  }

  // TODO: Replace Alert with Modal
  async function renderNotice(id: number, message: string) {
    try {
      const { noticeId } = await fetchNoticeId() || {};
      if (!noticeId || parseInt(noticeId) < id) {
        saveNoticeId(id);
        Alert.alert(
          'NOTICE', `${message}`, 
          [{ text: 'OK', style: 'cancel' }]
        );
      }
    } catch (error) {
      console.debug('error rendering notice:', error);
    }
  }

  return {
    renderNotice,
  };
}
