import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import LinkButton from '../components/link-button';
import { palette } from '../theme/main-theme';


export default function ContactUsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinkButton
          label="From your mobile"
          value="+64 9 475 7230"
          type="tel"
          containerStyle={styles.linkContainer}
        />
        <LinkButton
          label="From your landline"
          value="0800 773 729"
          type="tel"
          containerStyle={styles.linkContainer}
        />
        <LinkButton
          label="By email"
          value="helpdesk@globug.co.nz"
          type="mailto"
          containerStyle={styles.linkContainer}
        />
        <LinkButton
          label="Website"
          value="www.globug.co.nz"
          type="https"
          containerStyle={styles.linkContainer}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white
  },

  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 30,
  },

  linkContainer: {
    paddingLeft: 10,
    paddingBottom: 35,
  }
});