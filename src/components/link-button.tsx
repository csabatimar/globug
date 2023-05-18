import React from 'react';
import { TouchableOpacity, Linking, Text, Alert, StyleSheet } from 'react-native';
import { removeSpaces } from '../helpers/utils';
import { palette } from '../theme/main-theme';
import { AppHeader2Text, AppText } from './app-text';


interface Props {
  label: string;
  value: string;
  type: string
  containerStyle: {}
}

export default function LinkButton({ label, value, type, containerStyle = {} }: Props) {
  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={async () => {
        const url = `${type}:${removeSpaces(value)}`;
        try {
          await Linking.openURL(url);
        } catch (error) {
          console.warn('Warning:', error);
          Alert.alert('Sorry', `I cannot open the link ${url} on this device.`);
        }
      }}>
      <AppText>
        <Text style={styles.labelText}>{label}</Text>
      </AppText>
      <AppHeader2Text>
        <Text style={styles.valueText}>{value}</Text>
      </AppHeader2Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  labelText: {
    color: palette.dimGray,
  },

  valueText: {
    color: palette.lightBlue,
  }
});