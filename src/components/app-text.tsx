import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Props } from '../interfaces/common-interfaces';
import { mainTheme, palette } from '../theme/main-theme';


export const AppText = ({ children }: Props) => (
  <Text style={styles.appText}>{children}</Text>
);

export const AppHeader3Text = ({ children }: Props) => (
  <AppText>
    <Text style={styles.appHeader3Text}>{children}</Text>
  </AppText>
);

export const AppHeader2Text = ({ children }: Props) => (
  <AppText>
    <Text style={styles.appHeader2Text}>{children}</Text>
  </AppText>
);

export const AppHeader1Text = ({ children }: Props) => (
  <AppText>
    <Text style={styles.appHeader1Text}>{children}</Text>
  </AppText>
);

const styles = StyleSheet.create({
  appText: {
    // fontFamily: 'MuseoSansRounded-300',
    fontSize: mainTheme.fontSize.body,
  },
  appHeader1Text: {
    // fontFamily: 'MuseoSansRounded-300',
    fontSize: mainTheme.fontSize.h1,
    fontWeight: '400',
  },
  appHeader2Text: {
    fontSize: mainTheme.fontSize.h2,
    fontWeight: '400',
  },
  appHeader3Text: {
    fontSize: mainTheme.fontSize.h3,
    fontWeight: '400',
  }
});