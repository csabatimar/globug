import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppHeader1Text, AppHeader2Text } from '../components/app-text';
import CustomButton from '../components/custom-button';
import { palette } from '../theme/main-theme';


export default function LoadingErrorScreen({ route, navigation }: any) {
  return (
    <View style={styles.container}>
      <AppHeader1Text>{route.params.header}</AppHeader1Text>
      <View>
        <AppHeader2Text>We're sorry but there was a problem:</AppHeader2Text>
        <View style={styles.separator} />
        <AppHeader2Text>{route.params.message.toString()}</AppHeader2Text>
      </View>
      <View>
        <CustomButton
          accessibilityLabel='GoBack'
          isValidated={true}
          buttonTitle={route.params.buttonTitle}
          submitPressHandler={() => navigation.replace(route.params.destination)}
          styleProp={styles.button}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: palette.white,
    borderWidth: 1
  },

  separator: {
    height: 20,
  },

  button: {
    marginTop: 15, 
    paddingHorizontal: 30, 
    paddingVertical: 15,
    backgroundColor: palette.green, 
    borderRadius: 4, 
    borderWidth: 0.5
  }
});