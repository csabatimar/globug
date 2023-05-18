import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Header, Text } from '@rneui/themed';
import Icon from './icon';
import { mainTheme, palette } from '../theme/main-theme';


export default function PreviewPaymentHeader({ title, goBackHandler }: any) {
  function renderHeaderLeftComponent() {
    return (
      <TouchableOpacity onPress={goBackHandler}>
        <Icon.MaterialCommunity
          name='chevron-left'
          size={22}
          color={palette.dimGray}
        />
      </TouchableOpacity>
    );
  }

  function renderHeadeCenterComponent() {
    return <Text style={styles.headerText}>{title}</Text>
  }

  return (
    <Header
      backgroundColor={palette.white}
      leftComponent={renderHeaderLeftComponent()}
      centerComponent={renderHeadeCenterComponent()}
    />
  )
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: mainTheme.fontSize.h3,
    color: palette.dimGray,
    fontWeight: 'bold',
  }
});