import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mainTheme, palette } from '../../theme/main-theme';
import BalanceHeader from '../../components/balance-header';


interface RouteParams {
  title: string;
  nextScreen: string;
  destination: string;
  hasEmailOption: boolean;
}

type Nav = {
  navigate: (value: string, value2?: RouteParams) => void;
}

const { width } = Dimensions.get('window');

export default function TopUpScreen() {
  const navigation: Nav = useNavigation();

  const paymentMethods = [
    {
      id: '0',
      title: 'Debit/Credit card',
      description: 'Make a payment from my debit or my credit card',
      screen: 'CreditCard',
      hasEmailOption: true
    },

    {
      id: '1',
      title: 'Internet Banking',
      description: 'Make an instant payment from my Internet Banking',
      screen: 'A2A',
      hasEmailOption: false
    },
  ]

  function renderFlatListItem({ item }: any) {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={() =>  navigation.navigate('PaymentDetails', 
          {title: item.title, nextScreen: item.screen, hasEmailOption: item.hasEmailOption, destination: 'TopUp'})
        }
      >
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>Using {item.title} *</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
        <View style={styles.itemImageContainer}>
          <Image
            source={require('../../../assets/images/arrow_right.png')}
            style={styles.itemSelectImage}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <BalanceHeader />
      <View style={styles.paymentListContainer}>
        <FlatList
          data={paymentMethods}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          renderItem={renderFlatListItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <Text style={styles.disclaimerText}>
        * Processing fees apply and will be deducted from your top-up amount.
        {'\n\n'}
        Debit/Credit Card{'\t'}= 40 cents per top-up{'\n'}
        Internet Banking{'\t'}= 20 cents per top-up
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.lightGray,
  },

  paymentListContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: palette.white,
  },

  itemSeparator: {
    height: 1,
    backgroundColor: palette.gray,
    marginLeft: 10,
    marginRight: 10,
  },

  itemTextContainer: {
    flex: 9,
    flexDirection: 'column',
  },

  itemTitle: {
    fontSize: mainTheme.fontSize.h1,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
  },

  itemDescription: {
    fontSize: mainTheme.fontSize.bodySmall,
    color: palette.gray,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
  },

  itemImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemSelectImage: {
    width: width * 0.03,
    height: width * 0.07,
  },

  disclaimerText: {
    margin: 20,
    fontSize: mainTheme.fontSize.body,
    color: palette.dimGray,
  }
})