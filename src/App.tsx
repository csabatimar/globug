import 'react-native-gesture-handler';
import AppNavigation from './navigation/app-navigation';
import AuthContextProvider from './store/auth-context';
import ConsumptionContextProvider from './store/consumption-context';
import FirebaseServicesContextProvider from './store/firebase-services-context';
import ReconnectContextProvider from './store/reconnect-context';
import UserContextProvider from './store/user-context';


export default function App() {
  return (
    <FirebaseServicesContextProvider>
    <AuthContextProvider>
    <UserContextProvider>
    <ConsumptionContextProvider>
    <ReconnectContextProvider>
      <AppNavigation />
    </ReconnectContextProvider>
    </ConsumptionContextProvider>
    </UserContextProvider>
    </AuthContextProvider>
    </FirebaseServicesContextProvider>
  )
}
