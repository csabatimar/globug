import { useNavigation } from '@react-navigation/native';
import { ListItem, Slider, Switch } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { putReminders } from '../api/reminders-api';
import {
  AppHeader1Text, AppHeader2Text, AppHeader3Text, AppText
} from '../components/app-text';
import CustomButton from '../components/custom-button';
import Icon from '../components/icon';
import ModalComponent from '../components/modal';
import useIsLoading from '../hooks/use-is-loading';
import { Nav, Reminders } from '../interfaces/common-interfaces';
import encryptedStorage from '../store/encrypted-storage';
import { FirebaseServicesContext } from '../store/firebase-services-context';
import { palette } from '../theme/main-theme';


export default function RemindersScreen() {
  const navigation: Nav = useNavigation();
  const firebaseServicesCtx = useContext(FirebaseServicesContext);
  const [reminders, setReminders] = useState({ lowerLimitDollars: 10 } as Reminders);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const { fcmToken } = firebaseServicesCtx.fireBaseServicesState;
  const [isLoading, setLoading, LoadingIndicator] = useIsLoading();

  // Retrieve reminders from the device storage and set the screen state
  useEffect(() => {
    (async function () {
      const retrievedReminders = await encryptedStorage.getValueFor('REMINDERS');
      retrievedReminders && setReminders(retrievedReminders);
    }
    )();
  }, []);

  async function updateReminders() {
    setLoading(true);
    const result = await putReminders(reminders, fcmToken);
    //@ts-ignore
    if (result.status === 200) {
      setLoading(false);
      await encryptedStorage.save('REMINDERS', reminders);
      setModalHeader('Success!');
      setModalMessage('Reminders settings have been updated.')
      setIsModalVisible(true);

    }
    else {
      setLoading(false);
      setModalHeader('Oops!');
      setModalMessage('Unable to update reminders, try later, please.')
      setIsModalVisible(true);
      console.error(result);
    }
  }

  return (
    <React.Fragment>
      {
        isLoading ? <LoadingIndicator /> :
          isModalVisible ?
            (
              <View style={{ flex: 1 }}>
                <ModalComponent
                  header={modalHeader}
                  message={modalMessage}
                  buttonText='OK'
                  isVisible={isModalVisible}
                  onPressProp={() => {
                    setIsModalVisible(false);
                    navigation.navigate('BalanceAndUsage');
                  }}
                />
              </View>
            ) :
            <View style={styles.container}>
              <View style={styles.content}>
                <View style={styles.subHeadingRow}>
                  <AppHeader1Text>Reminders</AppHeader1Text>
                </View>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  scrollEnabled={true}
                >
                  <ListItem bottomDivider>
                    <ListItem.Content>
                      <AppHeader2Text>Let me know if I need to top-up</AppHeader2Text>
                    </ListItem.Content>
                  </ListItem>

                  <ListItem bottomDivider>
                    <ListItem.Content>
                      <AppHeader3Text>Before tomorrow</AppHeader3Text>
                    </ListItem.Content>
                    <Switch
                      color={palette.green}
                      value={reminders.beforeTomorrow}
                      onValueChange={(value) => {
                        setReminders({ ...reminders, beforeTomorrow: value });
                      }}
                    />
                  </ListItem>

                  <ListItem bottomDivider>
                    <ListItem.Content>
                      <AppHeader3Text>Today</AppHeader3Text>
                    </ListItem.Content>
                    <Switch
                      color={palette.green}
                      value={reminders.today}
                      onValueChange={(value) => {
                        setReminders({ ...reminders, today: value });
                      }}
                    />
                  </ListItem>

                  <ListItem bottomDivider>
                    <ListItem.Content>
                      <View style={styles.row}>
                        <Icon.Material
                          name='info'
                          size={19}
                          color={palette.dimGray}
                          style={styles.infoIcon}
                        />
                        <AppText>All notifications will be sent after 7am</AppText>
                      </View>
                    </ListItem.Content>
                  </ListItem>

                  <View style={styles.spacer} />

                  <ListItem>
                    <ListItem.Content>
                      <AppHeader2Text>Account balance reminder</AppHeader2Text>
                    </ListItem.Content>
                    <Switch
                      color={palette.green}
                      value={reminders.balance}
                      onValueChange={(value) => {
                        // LayoutAnimation.easeInEaseOut();
                        setReminders({ ...reminders, balance: value });
                      }}
                    />
                  </ListItem>

                  {reminders.balance && (
                    <ListItem>
                      <ListItem.Content>
                        <View style={styles.row}>
                          <Icon.Material
                            name='info'
                            size={19}
                            color={palette.dimGray}
                            style={styles.infoIcon}
                          />
                          <AppText>
                            {'We will notify you (after 7am) if your '
                              + `account balance goes below $${reminders.lowerLimitDollars}`}
                          </AppText>
                        </View>
                      </ListItem.Content>
                    </ListItem>
                  )}
                  <ListItem bottomDivider>
                    {reminders.balance && (
                      <ListItem.Content>
                        <View style={styles.sliderLabelRow}>
                          <AppHeader2Text>10</AppHeader2Text>
                          <AppHeader2Text>200</AppHeader2Text>
                        </View>
                        <View style={{ width: '100%' }}>
                          <Slider
                            value={reminders.lowerLimitDollars}
                            minimumValue={10}
                            maximumValue={200}
                            step={5}
                            onValueChange={(value) => {
                              setReminders({ ...reminders, lowerLimitDollars: value });
                            }}
                            thumbStyle={styles.sliderThumb}
                            minimumTrackTintColor={palette.green}
                          />
                        </View>
                      </ListItem.Content>
                    )}
                  </ListItem>
                </ScrollView>
              </View>
              <View style={{ width: '100%', alignItems: 'center' }}>
                <CustomButton
                  accessibilityLabel='updateReminders'
                  isValidated={true}
                  buttonTitle='UPDATE'
                  submitPressHandler={updateReminders}
                  styleProp={{
                    backgroundColor: palette.green,
                    borderRadius: 4,
                    paddingVertical: 15,
                    borderWidth: 0.5,
                    marginBottom: 30,
                    width: 150
                  }}
                />
              </View>
            </View>
      }
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white
  },

  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingHorizontal: 20,
  },

  subHeadingRow: {
    alignItems: 'center',
  },

  scrollContent: {
    flex: 1,
    marginTop: 50,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoIcon: {
    paddingRight: 5,
  },

  spacer: {
    height: 40,
  },

  sliderLabelRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  sliderThumb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: palette.dimGray,
    borderWidth: 1,
    backgroundColor: palette.lightGray,
  }
});