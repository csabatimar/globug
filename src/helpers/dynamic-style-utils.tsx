import { StyleSheet } from "react-native";
import { mainTheme, palette } from "../theme/main-theme";


export function showTopUpButton(color: string, connectionStatus: string) {
  if (color === 'red' && connectionStatus === 'Connecting') {
    // Show reconnection button
    return false;
  }

  if (
    (color === 'orange' || color === 'green') &&
    (connectionStatus === 'Connecting' || connectionStatus === 'Disconnected')
  ) {
    // Show reconnection button
    return false;
  }

  // Show top-up button
  return true;
}

export function getButtonColor(color: string, connectionStatus: string) {
  if (connectionStatus === 'Connecting' || connectionStatus === 'Disconnected') {
    return balanceAndUsageStyles.buttonGreen;
  } else {
    if (color === 'green') {
      return balanceAndUsageStyles.buttonGreen;
    } else if (color === 'orange') {
      return balanceAndUsageStyles.buttonOrange;
    } else {
      return balanceAndUsageStyles.buttonRed;
    }
  }
};

export function getUpperPanelColor(color: string, connectionStatus: string) {
  if (connectionStatus === 'Connecting' || connectionStatus === 'Disconnected') {
    return balanceAndUsageStyles.upperPanelWhite;
  } else {
    if (color === 'green') {
      return balanceAndUsageStyles.upperPanelGreen;
    } else if (color === 'orange') {
      return balanceAndUsageStyles.upperPanelOrange;
    } else {
      return balanceAndUsageStyles.upperPanelRed;
    }
  }
};

export function isBlackTextStyle(color: string, connectionStatus: string) {
  if (connectionStatus === 'Connecting' || connectionStatus === 'Disconnected') {
    // The background is white
    return true;
  }
  return false;
};

export function getTextStyle(color: string, connectionStatus: string) {
  return isBlackTextStyle(color, connectionStatus)
    ? balanceAndUsageStyles.topTextBlack
    : balanceAndUsageStyles.topTextWhite;
};

export function getConnectionStatusTextStyle(color: string, connectionStatus: string) {
  return isBlackTextStyle(color, connectionStatus)
    ? balanceAndUsageStyles.statusTextBlack
    : balanceAndUsageStyles.statusTextWhite;
};

export function getBigNumberTextStyle(color: string, connectionStatus: string) {
  return isBlackTextStyle(color, connectionStatus)
    ? balanceAndUsageStyles.bigNumberTextBlack
    : balanceAndUsageStyles.bigNumberTextWhite;
};

export const balanceAndUsageStyles = StyleSheet.create ({
  buttonGreen: {
    backgroundColor: palette.lightGreen,
    borderColor: palette.gray,
    borderWidth: 1,
    borderRadius: 5,
  },

  buttonOrange: {
    backgroundColor: palette.lightOrange,
    borderColor: palette.gray,
    borderWidth: 1,
    borderRadius: 5,
  },

  buttonRed: {
    backgroundColor: palette.lightRed,
    borderColor: palette.gray,
    borderWidth: 1,
    borderRadius: 5,
  },

  upperPanelGreen: {
    backgroundColor: palette.green,
    width: '100%',
    justifyContent: 'space-between',
    padding: 20,
  },

  upperPanelOrange: {
    backgroundColor: palette.orange,
    width: '100%',
    justifyContent: 'space-between',
    padding: 20,
  },

  upperPanelRed: {
    backgroundColor: palette.red,
    width: '100%',
    justifyContent: 'space-between',
    padding: 20,
  },

  upperPanelWhite: {
    backgroundColor: palette.white,
    width: '100%',
    justifyContent: 'space-between',
    padding: 20,
  },

  topTextBlack: {
    fontSize: mainTheme.fontSize.h3,
    color: palette.dimGray,
    fontWeight: '600',
  },

  topTextWhite: {
    fontSize: mainTheme.fontSize.h3,
    color: palette.white,
    fontWeight: '600',
  },

  statusTextBlack: {
    fontSize: mainTheme.fontSize.h2,
    color: palette.dimGray,
    fontWeight: '700',
  },

  statusTextWhite: {
    fontSize: mainTheme.fontSize.h2,
    color: palette.white,
    fontWeight: '700',
  },

  bigNumberTextBlack: {
    // fontFamily: 'MuseoSansRounded-300',
    fontSize: mainTheme.fontSize.hXL,
    fontWeight: '400',
    color: palette.dimGray,
  },

  bigNumberTextWhite: {
    // fontFamily: 'MuseoSansRounded-300',
    fontSize: mainTheme.fontSize.hXL,
    fontWeight: '400',
    color: palette.white,
  }
});