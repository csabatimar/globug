import BalanceAndUsageScreen from '../../screens/balance-and-usage-screen';
import TopUpScreen from '../../screens/top-up/top-up-screen';
import ContactUsScreen from '../../screens/contact-us-screen';
import { CustomDrawerHeader } from './custom-drawer-header';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { palette } from '../../theme/main-theme';
import { Image } from 'react-native';
import RemindersScreen from '../../screens/reminders-screen';


const Drawer = createDrawerNavigator();

function HeaderTitleHelper() {
  return (
    <Image source={require('../../../assets/images/globug-logo.png')} />
  );
}

export function CustomDrawer() {
    return (
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerHeader {...props} />}
        screenOptions={{ headerTintColor: palette.gray, swipeEdgeWidth: 0 }}
      >
        <Drawer.Screen name='BalanceAndUsage' component={BalanceAndUsageScreen}
          options={{ headerTitle: () => <HeaderTitleHelper />, headerTitleAlign: 'center' }}
        />
        <Drawer.Screen name='TopUp' component={TopUpScreen}
          options={{ headerTitle: () => <HeaderTitleHelper />, headerTitleAlign: 'center' }}
        />
        <Drawer.Screen name='Reminders' component={RemindersScreen}
          options={{ headerTitle: () => <HeaderTitleHelper />, headerTitleAlign: 'center' }}
        />
        <Drawer.Screen name='ReconnectMyPower' component={BalanceAndUsageScreen}
          options={{ headerTitle: () => <HeaderTitleHelper />, headerTitleAlign: 'center' }}
        />
        <Drawer.Screen name='ContactUs' component={ContactUsScreen}
          options={{ headerTitle: () => <HeaderTitleHelper />, headerTitleAlign: 'center' }}
        />
        <Drawer.Screen name='SignOut' component={BalanceAndUsageScreen}
          options={{ headerTitle: () => <HeaderTitleHelper />, headerTitleAlign: 'center' }}
        />
      </Drawer.Navigator>
    );
  }