import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import AppNavigation from './screens/Stack/AppNavigation';
import store from './redux/store';
import { useOneSignal } from './components/Hooks/useOneSignal';
import analytics from '@react-native-firebase/analytics';
import CustomToast from './components/Customs/CustomToast';

const App = () => {
  useOneSignal();

  const routeNameRef: any = useRef<string | undefined>(null);
  const navigationRef: any = useRef<string | undefined>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            const currentRoute = navigationRef.current?.getCurrentRoute();
            routeNameRef.current = currentRoute?.name;
          }}
          onStateChange={async () => {
            const currentRoute = navigationRef.current?.getCurrentRoute();
            const currentRouteName = currentRoute?.name;

            if (routeNameRef.current !== currentRouteName && currentRouteName) {
              await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              });
            }

            routeNameRef.current = currentRouteName;
          }}
        >
          <AppNavigation />
          <Toast />
          <CustomToast.ToastManager />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
