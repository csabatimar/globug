import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from '../icon';
import { palette } from '../../theme/main-theme';
import { AppHeader3Text } from '../app-text';
import { IconFamily } from '../../interfaces/common-interfaces';


interface Props {
  styleProp?: {};
  active: boolean;
  disabled?: boolean;
  submitPressHandler: () => void;
  iconFamily: string;
  iconName: string;
  iconColor: string;
  iconSize: number;
  title: string;
}

export default function DrawerElement(
  { styleProp, active, submitPressHandler, iconFamily, iconName, iconColor, iconSize, title, disabled}: Props
) {
  function RenderIcon() {
    switch (iconFamily) {
      case IconFamily.Material:
        return (<Icon.Material name={iconName} color={iconColor} size={iconSize} />)
      case IconFamily.MaterialCommunity:
        return (<Icon.MaterialCommunity name={iconName} color={iconColor} size={iconSize} />)
      case IconFamily.Entypo:
        return (<Icon.Entypo name={iconName} color={iconColor} size={iconSize} />)
      
      default:
        return (<Icon.MaterialCommunity name='circle-small' color={'black'} size={22} />)
    }
  }

  return (
    <View style={active ? styles.buttonActive : styles.buttonInactive}>
      <TouchableOpacity 
        disabled={disabled} 
        style={styleProp ? (styleProp) : disabled ? styles.disabled : styles.enabled} 
        onPress={submitPressHandler}
      >
        <RenderIcon />
        <AppHeader3Text>   {title}</AppHeader3Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  enabled: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingLeft: 20
  },
  
  disabled: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingLeft: 20,
    opacity: 0.5
  },

  buttonActive: {
    paddingVertical: 10,
    backgroundColor: palette.lightBlue,
  },

  buttonInactive: {
    paddingVertical: 10,
    backgroundColor: palette.white
  }
});