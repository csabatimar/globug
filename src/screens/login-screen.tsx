import React, { useEffect, useState, useContext } from 'react';
import { Image, SafeAreaView, StyleSheet, View, Text, Linking, TextInput } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '@react-native-community/checkbox';
import Icon from '../components/icon'
import { palette } from '../theme/main-theme';
import EncryptedStorage from '../store/encrypted-storage';
import { login } from '../api/globug-api';
import CustomButton from '../components/custom-button';
import { AuthContext } from '../store/auth-context';
import { setStatusBarStyle } from '../helpers/utils';
import useFirebaseServices from '../hooks/use-firebase-services';
import { FirebaseServicesContext } from '../store/firebase-services-context';
import useIsLoading from '../hooks/use-is-loading';

import Config from "react-native-config";


interface LoginError {
  header: string;
  message: string;
  buttonTitle: string;
  destination: string;
}

type Nav = {
  replace: (value: string, value2?: LoginError) => void;
}

setStatusBarStyle(palette.lightGray);

export default function LoginScreen() {
  const navigation: Nav = useNavigation();
  const authCtx = useContext(AuthContext);
  const firebaseServicesCtx = useContext(FirebaseServicesContext);
  const [isLoading, setLoading, LoadingIndicator] = useIsLoading();
  const [paymentCardNumber, setPaymentCard] = useState('');
  const [lastName, setLastName] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  // @ts-ignore
  const requestUserPermission = useFirebaseServices();
  const { maintenanceMode } = firebaseServicesCtx.fireBaseServicesState;

  useEffect(() => {
    requestUserPermission();
  }, []);

  useEffect(() => {
    setLoading(true);
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      if (authCtx.isAuthenticated) {
        //@ts-ignore
        navigation.navigate('Drawer');
      }
    }, [authCtx.isAuthenticated, navigation])
  );

  useEffect(() => {
    (async function () {
      const retrievedCredentials = await EncryptedStorage.getValueFor('CREDENTIALS');

      if (retrievedCredentials) {
        setLoading(false);
        setPaymentCard(retrievedCredentials.paymentCardNumber);
        setLastName(retrievedCredentials.lastName);
        setToggleCheckBox(true);
      }
      if (
        retrievedCredentials && 
        retrievedCredentials.accessToken && 
        retrievedCredentials.accessToken.length > 1
      ) {
        await authCtx.authenticate(retrievedCredentials.accessToken);
        //@ts-ignore
        navigation.navigate('Drawer');
      }

      setLoading(false);
    }
    )();
  }, [lastName])

  async function submitLoginHandler() {
    setLoading(true);
    
    let credentials = {
      paymentCardNumber: paymentCardNumber.trim(),
      lastName: lastName.trim(),
    };

    if (toggleCheckBox) {
      await EncryptedStorage.save('CREDENTIALS', credentials);
    };

    const loginResult = await login(credentials);

    if (loginResult && loginResult.toString().search('401') !== -1) {
      console.log(loginResult, 'Incorrect paymentCardNumber or lastName!');
      navigation.replace('LoginError', {
        header: 'Oops!',
        message: ('The card number or surname you entered is incorrect. ' +
          'Please try again and remember that passwords are case sensitive.'),
        buttonTitle: 'TRY AGAIN',
        destination: 'Login',
      });
    }

    if (loginResult.access_token) {
      authCtx.authenticate(loginResult.access_token);
      await EncryptedStorage.save('CREDENTIALS', {
        ...credentials, accessToken: loginResult.access_token
      });
    }
  };

  async function saveCredentialsHandler(newValue: boolean) {
    setToggleCheckBox(newValue);
    if (toggleCheckBox) {
      setPaymentCard('');
      setLastName('');
      await EncryptedStorage.removeValueFor('CREDENTIALS');
    }
  }

  const validated = Boolean(paymentCardNumber && lastName);

  if (isLoading) {
    return (
        <LoadingIndicator withText="Loading..." />
    )
  }

  let screen = (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={styles.content}>
      <SafeAreaView style={styles.safeContent}>
        <View>
          <Image
            style={styles.globugLogo}
            source={require('../../assets/images/globug-logo.png')}
          />
          <Text style={styles.welcomeText}>WELCOME</Text>
          <Text style={styles.otherText}>Get smart about power</Text>
          <Text style={styles.otherText}>{Config.GLOBUG_API_BASE_URL}</Text>
          <Text style={styles.otherText}>Please complete the fields below to start.</Text>
          <View>
            <View style={styles.inputField}>
              <Icon.Material
                name='credit-card'
                size={30}
                color={palette.dimGray}
                style={styles.iconStyle}
              />
              <TextInput
                accessibilityLabel="cardNumber"
                style={styles.inputStyle}
                autoCorrect={false}
                placeholder="Payment card number..."
                placeholderTextColor={palette.gray}
                value={paymentCardNumber}
                keyboardType="numeric"
                onChangeText={(value) => {
                  setPaymentCard(value);
                }}
              />
            </View>
            <View style={styles.inputField}>
              <Icon.Material
                name='person'
                size={30}
                color={palette.dimGray}
                style={styles.iconStyle}
              />
              <TextInput
                accessibilityLabel='surnameOnAccount'
                style={styles.inputStyle}
                autoCorrect={false}
                autoCapitalize='words'
                returnKeyType='send'
                placeholder='Surname on account...'
                placeholderTextColor={palette.gray}
                value={lastName}
                onChangeText={(value) => {
                  setLastName(value);
                }}
                onSubmitEditing={() => {
                  submitLoginHandler();
                }}
              />
            </View>
            <View style={styles.checkboxContainer}>
              <Text>Remember me on this device</Text>
              <CheckBox
                tintColor={palette.green}
                onCheckColor={palette.black}
                onFillColor={palette.green}
                onTintColor={palette.black}
                disabled={!validated}
                value={toggleCheckBox}
                onValueChange={saveCredentialsHandler}
              />
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton 
                accessibilityLabel='signIn'
                isValidated={validated}
                buttonTitle='SIGN IN'
                submitPressHandler={submitLoginHandler}
              />
            </View>
          </View>
        </View>
        <Image
          style={styles.glowie}
          source={require('../../assets/images/ic_signin_logo.png')}
        />
        <Text style={styles.termsAndConditions}>
          By logging in you agree that you have read,
          and consent to our
          <Text style={{ color: palette.blue }}
            onPress={() => Linking.openURL('https://www.globug.co.nz/terms-and-conditions/')}>
            &nbsp; terms and conditions, and privacy policy
          </Text>
        </Text>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  )

  if (maintenanceMode.enabled && maintenanceMode.type === 'block') {
    screen = (
      <SafeAreaView style={styles.safeContent}>
        <View>
          <Image
            style={styles.globugLogo}
            source={require('../../assets/images/globug-logo.png')}
          />
          <Text style={styles.welcomeText}>WELCOME</Text>
          <Text style={styles.otherText}>Get smart about power.</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
          <Text style={{...styles.otherText, fontWeight: 'bold'}}>
            {maintenanceMode.message}
          </Text>
        </View>
        <Image
          style={styles.glowie}
          source={require('../../assets/images/ic_signin_logo.png')}
        />
        <Text style={styles.termsAndConditions}>
          By logging in you agree that you have read,
          and consent to our
          <Text style={{ color: palette.blue }}
            onPress={() => Linking.openURL('https://www.globug.co.nz/terms-and-conditions/')}>
            &nbsp; terms and conditions, and privacy policy
          </Text>
        </Text>
      </SafeAreaView>
    );
  }

  return screen
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'space-between',
    backgroundColor: palette.lightGray
  },

  safeContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  globugLogo: {
    height: 100,
    width: '80%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },

  glowie: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  welcomeText: {
    color: palette.green,
    textAlign: 'center',
  },

  otherText: {
    textAlign: 'center',
    color: palette.dimGray,
  },

  termsAndConditions: {
    textAlign: 'center',
    color: palette.dimGray,
    margin: 5,
  },

  inputField: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: palette.green,
    margin: 5,
    backgroundColor: palette.white,
  },

  iconStyle: {
    alignSelf: 'center',
    margin: 15,
  },

  inputStyle: {
    flex: 1,
    color: palette.black,
  },

  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    marginHorizontal: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  buttonContainer: {
    margin: 5,
  }
});