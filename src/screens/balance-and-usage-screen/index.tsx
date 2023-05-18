import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../components/custom-button';
import RemainingDaysIndicator from '../../components/remaining-days-indicator';
import {
  getBigNumberTextStyle, getButtonColor, getConnectionStatusTextStyle,
  getTextStyle, getUpperPanelColor, isBlackTextStyle, showTopUpButton
} from '../../helpers/dynamic-style-utils';
import { formatBalance } from '../../helpers/utils';
import { Nav } from '../../interfaces/common-interfaces';
import { UserContext } from '../../store/user-context';
import { mainTheme, palette } from '../../theme/main-theme';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DailyConsumptionTab from './daily-consumption-tab';
import WeeklyConsumptionTab from './weekly-consumption-tab';
import MonthlyConsumptionTab from './monthly-consumption-tab';
import useReconnectionRequest from '../../hooks/use-reconnection-request';
import { ReconnectContext } from '../../store/reconnect-context';
import ModalComponent from '../../components/modal';


const Tab = createMaterialTopTabNavigator();

export default function BalanceAndUsageScreen() {
  const navigation: Nav = useNavigation();
  const { userProfile } = useContext(UserContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isReconnectionRequested } = useContext(ReconnectContext);
  const { requestReconnectionAndSaveToDevice } = useReconnectionRequest();

  // Style Variables
  const topUpButtonVisible = showTopUpButton(
    userProfile.color,
    userProfile.connectionStatus,
  );

  const buttonStyleColor = getButtonColor(
    userProfile.color,
    userProfile.connectionStatus,
  );

  const panelStyleColor = getUpperPanelColor(
    userProfile.color,
    userProfile.connectionStatus,
  );

  const textStyle = getTextStyle(
    userProfile.color,
    userProfile.connectionStatus,
  );

  const connectionStatusTextStyle = getConnectionStatusTextStyle(
    userProfile.color,
    userProfile.connectionStatus,
  );

  const bigNumberTextStyle = getBigNumberTextStyle(
    userProfile.color,
    userProfile.connectionStatus,
  );

  const dollarSignTextStyle = getBigNumberTextStyle(
    userProfile.color,
    userProfile.connectionStatus,
  );

  const textColor = isBlackTextStyle(
    userProfile.color,
    userProfile.connectionStatus,
  ) ? palette.dimGray : palette.white;

  const isWhite = isBlackTextStyle(
    userProfile.color,
    userProfile.connectionStatus,
  );

  function modalConfirmButtonHandler() {
    requestReconnectionAndSaveToDevice(userProfile.customerReference);  
    setIsModalVisible(false);
  }

  return (
    <View style={{ flex: 1 }}>
      {isModalVisible ?
        (
          <View style={{ flex: 1 }}>
            <ModalComponent
              header='Reconnect Now'
              message={'For safety reasons we need you to confirm that ' + 
              'it is safe to reconnect your power before we switch it back on. We recommend that you make sure ' +
              'that all appliances are turned off and that a person over 18 years is present on site'}
              buttonText='Confirm'
              isVisible={isModalVisible}
              onPressProp={modalConfirmButtonHandler}
              cancel={true}
              cancelHandler={() => setIsModalVisible(false)}    
            />
          </View>
        ) :
        <View style={styles.content}>
          <View style={panelStyleColor}>
            <View style={{ alignItems: 'center' }}>
              <Text style={textStyle}>Account Balance</Text>
              <View style={styles.bigNumberRow}>
                <Text style={dollarSignTextStyle}>$</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={bigNumberTextStyle} >
                  {formatBalance(userProfile.accountBalance)}
                </Text>
              </View>
              <Text style={connectionStatusTextStyle}>
                {userProfile.connectionStatus}
              </Text>
              <RemainingDaysIndicator
                remainingDays={userProfile.estimatedRemainingDays}
                color={userProfile.color}
                textColor={textColor}
                isWhite={isWhite}
                isTopUp={topUpButtonVisible}
              />
              {userProfile.debtBalance > 0 && (
                <>
                  <View style={styles.separator} />
                  <View style={{ paddingVertical: 3 }}>
                    <Text style={textStyle}>
                      {'My remaining debt: $' +
                        formatBalance(userProfile.debtBalance)}
                    </Text>
                  </View>
                </>
              )}
            </View>
            {topUpButtonVisible ? (
              <CustomButton
                accessibilityLabel='TopUp'
                isValidated={true}
                buttonTitle='TOP-UP NOW'
                submitPressHandler={() => { navigation.navigate('TopUp') }}
                styleProp={{ ...buttonStyleColor, paddingVertical: 10 }}
                textStyleProp={styles.buttonTitleText}
              />
            ) : (
              <CustomButton
                accessibilityLabel='Reconnect'
                isValidated={!isReconnectionRequested}
                buttonTitle='RECONNECT NOW'
                submitPressHandler={() => {
                  setIsModalVisible(true);
                }}
                styleProp={
                  !isReconnectionRequested ?
                    { ...buttonStyleColor, paddingVertical: 10 } :
                    { ...buttonStyleColor, paddingVertical: 10, backgroundColor: palette.gray, opacity: 0.5 }
                }
                textStyleProp={styles.buttonTitleText}
              />
            )}
          </View>

          <SafeAreaView style={styles.bottomPanel}>
            <View style={styles.bottomPanelHeader}>
              <Text style={styles.bottomPanelHeaderText}>Your Power Costs</Text>
            </View>
            <View style={{ flex: 1, width: '100%' }}>

              <Tab.Navigator
                screenOptions={{
                  tabBarPressColor: 'white',
                  animationEnabled: false,
                  swipeEnabled: false,
                  tabBarIndicatorStyle: { borderBottomColor: palette.lightBlue, borderBottomWidth: 4 },
                }}
              >
                <Tab.Screen name="Daily" component={DailyConsumptionTab} options={{ tabBarLabel: 'Daily' }} />
                <Tab.Screen name="Weekly" component={WeeklyConsumptionTab} />
                <Tab.Screen name="Monthly" component={MonthlyConsumptionTab} />
              </Tab.Navigator>
            </View>
          </SafeAreaView>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
  },

  bigNumberRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  separator: {
    width: '30%',
    height: 1,
    backgroundColor: palette.dimGray,
    marginVertical: 2,
  },

  buttonTitleText: {
    alignSelf: 'center',
    fontSize: mainTheme.fontSize.h3,
    fontWeight: '500',
    color: palette.dimGray
  },

  bottomPanel: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    borderTopColor: palette.lightGray,
    borderWidth: 1
  },

  bottomPanelHeader: {
    backgroundColor: palette.white,
    width: '100%',
    alignItems: 'center'
  },

  bottomPanelHeaderText: {
    fontSize: mainTheme.fontSize.h3,
    paddingTop: 10,
    color: palette.dimGray,
    fontWeight: '600',
  }
});