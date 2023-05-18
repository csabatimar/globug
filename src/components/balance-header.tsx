import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserContext } from '../store/user-context';
import { palette } from '../theme/main-theme';


export default function BalanceHeader() {
  const userCtx = useContext(UserContext);

  function getBackgroundColor() {
    switch (userCtx.userProfile.color) {
      case 'green':
        return palette.green;
      case 'orange':
        return palette.orange;
      case 'red':
        return palette.red;
      default:
        break;
    }
  }

  return (
    <View style={{ ...styles.balanceContainer, backgroundColor: getBackgroundColor() }}>
      <Text style={{ textAlign: 'center', color: palette.white }}>
        Account balance ${userCtx.userProfile.accountBalance}
      </Text>
      <Text style={{ textAlign: 'center', color: palette.white }}>
        My remaining debt ${userCtx.userProfile.debtBalance}
      </Text>
    </View>

  )
}

const styles = StyleSheet.create({
  balanceContainer: {
    flexDirection: 'column',
    paddingTop: 5,
    paddingBottom: 5,
  }
});