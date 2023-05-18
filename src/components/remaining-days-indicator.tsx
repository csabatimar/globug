import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Popable } from 'react-native-popable';
import Icon from './icon';
import { mainTheme, palette } from '../theme/main-theme';


interface Props {
  remainingDays: number,
  color: string,
  textColor: string,
  isWhite: boolean,
  isTopUp: boolean,
}

export default function RemainingDaysIndicator(  
  {remainingDays, color, textColor, isWhite,isTopUp}: Props
){
  return (
    <React.Fragment>
      {
        (color === 'orange' && !isWhite) ? (
          <View style={styles.row}>
            <Text style={{...styles.topText, color:textColor}}>
              Power will be disconnected at midday tomorrow
            </Text>
          </View>
        ) : (color === 'red' && !isWhite) ? (
          <View style={styles.row}>
            <Text style={{...styles.topText, color:textColor}}>
              Power will be disconnected at midday today
            </Text>
          </View>
        ) : (isWhite) ? (
          <View style={styles.row}>
            <Text style={{...styles.topText, color:textColor}}>
              {isTopUp ? 'Please top-up to reconnect' : ''}
            </Text>
          </View>

        ) : (
          (remainingDays > 0) && (
            <View style={styles.row}>
              <Text style={{...styles.topText, color:textColor}}>
                {`About ${remainingDays} day${remainingDays !== 1 ? 's' : ''} remaining`}
              </Text>
              <Popable
                animationType="spring"
                style={{ width: 200 }}
                // caretPosition="right"
                position="top"
                backgroundColor={palette.dimGray}
                content={
                  'The time remaining until disconnection is estimated' +
                  ' based on usage in the last 7 days. If you increase or' +
                  ' decrease your power usage, estimates may not be' +
                  ' accurate. We cannot provide this estimate if we do' +
                  ' not have 7 days of usage history.'
                }
              >
                <Icon.Material name="info" color={textColor} size={20} style={styles.infoIcon} />
              </Popable>
            </View>
          )
        )
      }
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
    row: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingBottom: 2,
    },

    connectedText: {
      fontSize: mainTheme.fontSize.h1,
      color: '',
      fontWeight: '600',
    },

    topText: {
      // fontFamily: 'MuseoSansRounded-300',
      fontSize: mainTheme.fontSize.bodySmall,
      color: '',
      fontWeight: '500',
    },

    infoIcon: {
      paddingLeft: 5,
    }
});