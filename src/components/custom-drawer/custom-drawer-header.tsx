import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList }
  from '@react-navigation/drawer';
import { UserContext } from '../../store/user-context';
import { displayDate, displayName, setStatusBarStyle } from '../../helpers/utils';
import { AppHeader1Text, AppHeader3Text, AppText } from '../app-text';
import { palette } from '../../theme/main-theme';
import { ParamListBase } from '@react-navigation/native';
import DrawerElement from './drawer-element';
import { IconFamily } from '../../interfaces/common-interfaces';
import ModalComponent from '../modal';
import useAppServices from '../../hooks/use-app-services';
import useNotice from '../../hooks/use-notice';
import { FirebaseServicesContext } from '../../store/firebase-services-context';
import useReconnectionRequest from '../../hooks/use-reconnection-request';
import { showTopUpButton } from '../../helpers/dynamic-style-utils';
import { ReconnectContext } from '../../store/reconnect-context';


interface RouteState {
  default?: string;
  history?: unknown[] | History[];
  index: number;
  key: string;
  routeNames: string[];
  routes: ParamListBase | Route[];
  stale: boolean;
  type: string;
  name?: string;
}

interface History {
  key: string;
  type: string;
}

interface Route {
  key: string;
  name: string;
  params: string;
}

const getActiveRouteState = function (route: any): RouteState {
  if (!route.routes || route.routes.length === 0 || route.index >= route.routes.length) {
    return route;
  }

  const childActiveRoute = route.routes[route.index] as any;
  return getActiveRouteState(childActiveRoute);
}

setStatusBarStyle(palette.white);

export function CustomDrawerHeader(props: DrawerContentComponentProps) {
  const activeRoute = getActiveRouteState(props.navigation.getState());
  const {userProfile} = useContext(UserContext);
  const firebaseServicesCtx = useContext(FirebaseServicesContext);
  const {isReconnectionRequested} = useContext(ReconnectContext);
  const {
    fetchReconnectTimeStamp, requestReconnectionAndSaveToDevice
  } = useReconnectionRequest();
  const [isLoading, setIsLoading] = useState(true);
  const {refreshUserProfile, logout} = useAppServices();
  const { maintenanceMode } = firebaseServicesCtx.fireBaseServicesState;
  const { renderNotice } = useNotice();
  const [modal, setModal] = useState({
    modalHeader: '',
    modalMessage: '',
    isModalVisible: false,
    cancelButton: false,
    buttonText: '',
    buttonHandler: () => {},
    cancelHandler: () => {},
  });

  let screen;

  function signOutHandler() {
    setModal(prevState => ({...prevState, isModalVisible: false}));
    logout();
  }

  function logoutModalHandler() {
    setModal(prevState => ({...prevState, modalHeader: 'Are you sure?'}));
    setModal(prevState => ({...prevState, modalMessage: 'If you sign out, you will need ' +
      ' to enter your login details the next time you use the Globug app.'
    }));
    setModal(prevState => ({...prevState, buttonText: 'Yes'}));
    setModal(prevState => ({...prevState, buttonHandler: signOutHandler}));
    setModal(prevState => ({...prevState, cancelButton: true}));
    setModal(prevState => ({...prevState, cancelHandler: () => setModal({...modal, isModalVisible: false})}));
    setModal(prevState => ({...prevState, isModalVisible: true}));
  }

  function requestReconnectHandler() {
    setModal(prevState => ({...prevState, isModalVisible: false}));
    setIsLoading(true);
    requestReconnectionAndSaveToDevice(userProfile.customerReference);
    setIsLoading(false);
  }

  function reconnectModalHandler() {
    setModal(prevState => ({...prevState, modalHeader: 'Reconnect Now'}));
    setModal(prevState => ({...prevState, modalMessage: 'For safety reasons we need you to confirm that ' + 
      'it is safe to reconnect your power before we switch it back on. We recommend that you make sure ' +
      'that all appliances are turned off and that a person over 18 years is present on site'
    }));
    setModal(prevState => ({...prevState, buttonText: 'Confirm'}));
    setModal(prevState => ({...prevState, buttonHandler: requestReconnectHandler}));
    setModal(prevState => ({...prevState, cancelButton: true}));
    setModal(prevState => ({...prevState, cancelHandler: () => setModal({...modal, isModalVisible: false})}));
    setModal(prevState => ({...prevState, isModalVisible: true}));
  }


  useEffect(() => {
    (userProfile.customerReference) && setIsLoading(false);
    (modal.isModalVisible) && props.navigation.closeDrawer();
  }, [userProfile, isLoading, modal.isModalVisible]);
  
  // Refreshing user profile every minute
  useEffect(() => {
    if(!isLoading) {
      fetchReconnectTimeStamp();
      const interval = setInterval(() => {
        refreshUserProfile();
        fetchReconnectTimeStamp();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isLoading, userProfile, isReconnectionRequested]);

  // Handle Maintenace mode message
  useEffect(() => {
    if (maintenanceMode.enabled && maintenanceMode.type === 'notice') {
      renderNotice(maintenanceMode.id, maintenanceMode.message);
      // encryptedStorage.removeValueFor('NOTICE');
    }

    if (maintenanceMode.enabled && maintenanceMode.type === 'block') {
      logout();
    }
  }, [maintenanceMode])
  
  const isReconnectionCapable = !showTopUpButton(
    userProfile.color, userProfile.connectionStatus
  )&& !isReconnectionRequested;

  if (modal.isModalVisible) {
    screen = (
        <ModalComponent
          header={modal.modalHeader}
          message={modal.modalMessage}
          buttonText={modal.buttonText}
          isVisible={modal.isModalVisible}
          onPressProp={modal.buttonHandler}
          cancel={modal.cancelButton}
          cancelHandler={modal.cancelHandler}
        />
    )
  }
  else {
    screen = (
      <View style={styles.container}>
        <DrawerContentScrollView {...props} >
          <View style={styles.leftIndent}>
            <Image source={require('../../../assets/images/globug-logo.png')} />
          </View>
          <View style={{ ...styles.separator, marginVertical: 10 }} />
          {
            (isLoading) ? (
                <ActivityIndicator style={{ marginVertical: 30}} color={palette.dimGray} size='small' />
              ) :
              (              
                <View style={{ ...styles.leftIndent, marginBottom: 6 }}>
                  <AppHeader1Text>{displayName(userProfile)}</AppHeader1Text>
                  <AppHeader3Text>
                    <Text>{'\n'}Account {userProfile.customerReference}</Text>
                  </AppHeader3Text>
                  <AppText>{userProfile.address}{'\n'}</AppText>
                  {
                    userProfile.lastPayment && userProfile.lastPayment > 0 && (
                      <AppText>
                        <Text>
                          Last top-up: ${userProfile.lastPayment} on{' '}
                          {displayDate(userProfile.lastPaymentTimestamp)}
                        </Text>
                      </AppText>
                    )
                  }
                </View>
              )
          }
          <View style={{ ...styles.separator }} />
          <View style={styles.buttonsContiner}>
            <DrawerElement
              active={activeRoute.name === 'BalanceAndUsage'}
              submitPressHandler={() => props.navigation.navigate('BalanceAndUsage')}
              iconFamily={IconFamily.MaterialCommunity}
              iconName='lightning-bolt'
              iconColor={palette.black}
              iconSize={22}
              title='Balance and usage'
            />
            <View style={styles.separator} />

            <DrawerElement
              active={activeRoute.name === 'TopUp'}
              submitPressHandler={() => props.navigation.navigate('TopUp')}
              iconFamily={IconFamily.Material}
              iconName='attach-money'
              iconColor={palette.black}
              iconSize={22}
              title='Top-up'
            />
            <View style={styles.separator} />

            <DrawerElement
              active={activeRoute.name === 'Reminders'}
              submitPressHandler={() => props.navigation.navigate('Reminders')}
              iconFamily={IconFamily.MaterialCommunity}
              iconName='bell'
              iconColor={palette.black}
              iconSize={20}
              title='Reminders'
            />
            <View style={styles.separator} />

            <DrawerElement
              disabled={!isReconnectionCapable}
              active={activeRoute.name === ''}
              submitPressHandler={reconnectModalHandler}
              iconFamily={IconFamily.MaterialCommunity}
              iconName='power-socket-au'
              iconColor={palette.black}
              iconSize={20}
              title='Reconnect my power'
            />
            <View style={styles.separator} />

            <DrawerElement
              active={activeRoute.name === 'ContactUs'}
              submitPressHandler={() => props.navigation.navigate('ContactUs')}
              iconFamily={IconFamily.Entypo}
              iconName='user'
              iconColor={palette.black}
              iconSize={18}
              title='Contact us'
            />
            <View style={styles.separator} />

            <DrawerElement
              active={activeRoute.name === ''}
              submitPressHandler={logoutModalHandler}
              iconFamily={IconFamily.Material}
              iconName='logout'
              iconColor={palette.black}
              iconSize={20}
              title='Sign out'
            />
            <View style={styles.separator} />
          </View>
          <View style={{ display: 'none' }}>
            <DrawerItemList {...props} />
          </View>
        </DrawerContentScrollView>
      </View>
    )
  }

  return (
    <React.Fragment>
      {screen}
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  separator: {
    height: 1,
    width: '100%',
    backgroundColor: palette.lightGray,
  },

  leftIndent: {
    paddingLeft: 30,
    paddingRight: 10
  },
  
  buttonsContiner: {
    flex: 6,
  }
});