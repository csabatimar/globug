import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { palette } from '../theme/main-theme';


interface Props {
  styleProp?: {};
  textStyleProp?: {};
  accessibilityLabel: string;
  isValidated: boolean;
  buttonTitle: string;
  submitPressHandler: () => void;
}

export default function CustomButton(
  {styleProp, textStyleProp, accessibilityLabel, isValidated, buttonTitle, submitPressHandler}: Props
) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        accessibilityLabel={accessibilityLabel}
        style={styleProp ? (styleProp) : isValidated ? (styles.button) : (styles.disabledButton)}
        onPress={submitPressHandler}
        disabled={!isValidated}
      >
        <Text style={textStyleProp? textStyleProp : styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    </View>

  )
}

const styles = StyleSheet.create({
  buttonContainer: {
  },

  button: {
    backgroundColor: palette.green,
    borderRadius: 4,
    paddingVertical: 15,
    borderWidth: 0.5,
  },

  disabledButton: {
    backgroundColor: palette.gray,
    borderRadius: 4,
    paddingVertical: 15,
    borderWidth: 0.5,
    opacity: 0.5
  },
  
  buttonText: {
    alignSelf: 'center',
    fontWeight: 'bold',
  }
});