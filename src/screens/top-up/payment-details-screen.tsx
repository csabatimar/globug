import CheckBox from '@react-native-community/checkbox';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BalanceHeader from '../../components/balance-header';
import CustomButton from '../../components/custom-button';
import ModalComponent from '../../components/modal';
import PreviewPaymentHeader from '../../components/preview-payment-header';
import { mainTheme, palette } from '../../theme/main-theme';
import PaymentValidationService from '../../helpers/payment-validation-service';


export default function PaymentDetailsScreen({ route, navigation }: any) {
  const { isValidAmount, isValidEmail } = PaymentValidationService();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasCheckedEmail, setHasCheckedEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  function onSubmitPressHandler() {
    if (!isValidAmount(amount)) {
      setModalMessage(`You have entered invalid top-up amount: ${amount}. ` +
        'Please enter top-up amount between $10.00 and $500.00.');
      setIsModalVisible(true);
    }
    else if (
      hasCheckedEmail && !isValidEmail(email)
    ) {
      setModalMessage(`You have entered invalid email address: ${email}.`);
      setIsModalVisible(true);
    }
    else {
      navigation.navigate(
        route.params.nextScreen, 
        { title: route.params.title, amount: amount, email: email }
      );
    }
  }

  const emailContainer = (
    <View style={styles.emailContainer}>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={hasCheckedEmail}
          onValueChange={(newValue) => setHasCheckedEmail(newValue)}
        />
        <Text style={{ marginLeft: 10 }}>Email me a receipt</Text>
      </View>
      <TextInput
        style={styles.input}
        editable={hasCheckedEmail}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Enter email address..."
        placeholderTextColor={palette.gray}
        keyboardType="email-address"
      />
    </View>
  );

  return (
    <>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <PreviewPaymentHeader title={route.params.title} goBackHandler={() => navigation.goBack()} />
        <BalanceHeader />
        <View style={{ flexDirection: 'column', margin: 20 }}>
          {(isModalVisible) && (
            <ModalComponent
              header='Oops!'
              message={modalMessage}
              buttonText='OK'
              isVisible={isModalVisible}
              onPressProp={() => setIsModalVisible(false)}
            />
          )}
          <TextInput
            style={styles.input}
            onChangeText={(text) => setAmount(text)}
            value={amount}
            placeholder="Enter top-up amount - Minimum $10"
            placeholderTextColor={palette.gray}
            keyboardType="numeric"
          />
          {route.params.hasEmailOption && emailContainer}
          <CustomButton
            accessibilityLabel='TopUp'
            buttonTitle='CONTINUE'
            isValidated={amount.length > 1}
            submitPressHandler={onSubmitPressHandler}
            styleProp={amount.length > 1 ? (styles.button) : (styles.disabledButton)}
            textStyleProp={styles.buttonText}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  emailContainer: {
    flexDirection: 'column',
    marginTop: 20,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    fontSize: mainTheme.fontSize.h3,
    padding: 15,
    borderWidth: 1,
    borderColor: palette.gray,
    backgroundColor: palette.white,
    color: palette.black,
    marginTop: 20,
  },

  button: {
    marginTop: 20,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: '1%',
    minWidth: '30%',
    textAlign: 'center',
    backgroundColor: palette.lightBlue,
  },

  disabledButton: {
    marginTop: 20,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: '1%',
    minWidth: '30%',
    textAlign: 'center',
    backgroundColor: palette.gray,
  },

  buttonText: {
    padding: 10,
    fontSize: mainTheme.fontSize.body,
    fontWeight: 'bold',
    color: palette.white,
    textAlign: 'center',
  }
});