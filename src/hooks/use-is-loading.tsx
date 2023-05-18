import React, { Dispatch, SetStateAction, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { AppHeader1Text } from '../components/app-text';
import { palette } from '../theme/main-theme';


type Props = {
  withText?: string;
};

function  ActivityIndicatorWrapper ({ withText }: Props): JSX.Element {
  return (
    <View style={styles.container}>
      {
        withText ? 
          <React.Fragment>
          <AppHeader1Text>{withText}</AppHeader1Text> 
          <View style={{margin: 10}} />
          </React.Fragment>
          : null
      }
      <ActivityIndicator size="large" />
    </View>
  );
};

export default function useIsLoading (): 
  [boolean, Dispatch<SetStateAction<boolean>>, React.FC<Props>] 
{
  const [isLoading, setIsLoading] = useState(false);

  const LoadingIndicator: React.FC<Props> = ({ withText }) =>
    isLoading ? <ActivityIndicatorWrapper withText={withText} /> : null;

  return [isLoading, setIsLoading, LoadingIndicator];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.white
  },
});
