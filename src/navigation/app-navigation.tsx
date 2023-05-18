import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../store/auth-context';
import LoginScreen from '../screens/login-screen';
import LoadingErrorScreen from '../screens/loading-error-screen';
import { CustomDrawer } from '../components/custom-drawer/custom-drawer';
import useAppServices from '../hooks/use-app-services';
import CreditCardScreen from '../screens/top-up/credit-card-screen';
import A2AScreen from '../screens/top-up/a2a-screen';
import PaymentDetailsScreen from '../screens/top-up/payment-details-screen';
import useIsLoading from '../hooks/use-is-loading';
import { UserContext } from '../store/user-context';


const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='LoginError' component={LoadingErrorScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none'
      }}
    >
      <Stack.Screen
        name='Drawer'
        component={CustomDrawer}
      />
      <Stack.Screen name='PaymentDetails' component={PaymentDetailsScreen} />
      <Stack.Screen name='CreditCard' component={CreditCardScreen} />
      <Stack.Screen name='A2A' component={A2AScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigation() {
  const {isAuthenticated} = useContext(AuthContext);
  const {userProfile} = useContext(UserContext);
  const { setUserProfileStore, setConsumptionStore } = useAppServices();
  const [isLoading, setLoading, LoadingIndicator] = useIsLoading();

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      setUserProfileStore();
      setConsumptionStore();
      if (userProfile.customerReference && userProfile.customerReference.length > 1) setLoading(false);
    }
  }, [isAuthenticated, userProfile]);

  return (
    <NavigationContainer>
      {!isAuthenticated && <AuthStack />}
      {isLoading ? 
        <LoadingIndicator withText='Loading...' /> : 
        isAuthenticated && <AuthenticatedStack />
      }
    </NavigationContainer>
  );
}
