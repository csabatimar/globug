import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import Config from 'react-native-config';
import { WebView } from 'react-native-webview';
import { createPayment, updatePayment } from '../../api/globug-api';
import BalanceHeader from '../../components/balance-header';
import ModalComponent from '../../components/modal';
import PreviewPaymentHeader from '../../components/preview-payment-header';
import { PaymentResponse, PaymentType } from '../../interfaces/common-interfaces';
import { UserContext } from '../../store/user-context';
import { palette } from '../../theme/main-theme';


// TODO: common webview component
export default function A2AScreen({ route, navigation }: any) {
  const userCtx = useContext(UserContext);
  const [paymentResponse, setPaymentResponse] = useState({} as PaymentResponse);
  const [isLoading, setIsLoadng] = useState(true);
  const [webViewIsLoading, setWebViewIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const paymentRequest = {
    paymentType: PaymentType.ACCOUNT_TO_ACCOUNT,
    amount: route.params.amount ? Number(route.params.amount) : 0,
    accountReference: userCtx.userProfile.customerReference,
    channel: Platform.OS === 'ios' ? 'ios' : 'android',
    redirectUrls: {
      success: Config.PAYMENT_AA_SUCCESS_CALLBACK,
      failure: Config.PAYMENT_AA_FAILURE_CALLBACK,
    }
  }

  useEffect(() => {
    (async function () {
      setPaymentResponse(await createPayment(paymentRequest));
    })();
  }, []);

  useEffect(() => {
    (paymentResponse && paymentResponse.gatewayUrl) && setIsLoadng(false);

    if (paymentResponse.status && paymentResponse.status === 409) {
      setModalHeader('Oops!');
      setModalMessage('A previous payment request is still being processed. ' +
        'Please, wait about 10 minutes and check your balance before ' +
        'creating another payment.'
      );
      setIsModalVisible(true);
    }

    paymentResponse.data?.error && console.debug(
      'ERROR: ', paymentResponse.data?.error.message
    );

    (
      paymentResponse.transactionId && 
      paymentResponse.transactionId.length > 1
    ) && updatePayment(paymentRequest, paymentResponse);

  }, [paymentResponse, isModalVisible]);

  function  extractTransactionId(url: string): string {
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    const params = {};
    let match;

    while ((match = regex.exec(url))) {
      // @ts-ignore
      params[match[1]] = match[2];
    }
    // @ts-ignore
    const reference = params.result;
    return reference;
  }
  
  function NavigationStateChangeHandler(navState: any) {
    setWebViewIsLoading(navState.loading);

    const { url } = navState;
    if (url.includes('success-fprna2a?') && !navState.loading) {
      console.debug('A2A Payment Transaction Succeeded');
      setModalHeader('Payment Accepted');
      setModalMessage('Your payment has been successful! ' + 
      'It may take a couple of minutes for the payment to be processed' + 
      ' and for the funds to be credited to your Globug account.'
      );
      setIsModalVisible(true);

      const extractedTransactionId = extractTransactionId(url);
      setPaymentResponse(prevState => (
        {...prevState, transactionId: extractedTransactionId }
      ));
    }

    if (url.includes('failure-fprna2a?')  && !navState.loading) {
      console.debug('A2A Payment Transaction Failure');
      setModalHeader('Payment Failed');
      setModalMessage('Your payment has been unsuccessful! ' +
        'Please, check that you have entered your details ' +
        'correctly and have sufficient funds in your bank account.'
      );
      setIsModalVisible(true);
    }
  }

  const INJECTEDJAVASCRIPT = `
    const meta = document.createElement('meta'); 
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1'); 
    meta.setAttribute('name', 'viewport'); 
    document.getElementsByTagName('head')[0].appendChild(meta); 
  `;

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <PreviewPaymentHeader title={route.params.title} goBackHandler={() => navigation.goBack()} />
      <BalanceHeader />
      {(isLoading && !isModalVisible) ?
        <ActivityIndicator size="large" style={styles.activityIndicator} /> :
          isModalVisible ? 
          ( 
            <View style={{flex: 1}}>
              <ModalComponent
                header={modalHeader}
                message={modalMessage}
                buttonText='OK'
                isVisible={isModalVisible}
                onPressProp={() => navigation.navigate('BalanceAndUsage')}
              />
            </View>
          ) :
        <View style={{ flex: 1 }}>
          {typeof paymentResponse.gatewayUrl !== 'undefined' &&
            (<WebView
              injectedJavaScript={INJECTEDJAVASCRIPT}
              scrollEnabled
              originWhitelist={['*']}
              onNavigationStateChange={NavigationStateChangeHandler}
              source={{uri: paymentResponse.gatewayUrl}}
            />
          )}
          {(Platform.OS === 'ios' && webViewIsLoading) && (
            <ActivityIndicator
              color={palette.dimGray}
              style={styles.activityIndicator}
              size="large"
            />
          )}
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});