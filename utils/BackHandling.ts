import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

export const useBackHandler = (
  screen: string = 'DrawerNav',
  handleNav?: () => void
) => {
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    const backAction = () => {
      return true; // Prevent default hardware back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    const timer = setTimeout(() => {
      if (handleNav) {
        handleNav(); // Use custom nav handler if provided
      } else {
        navigation.navigate('DrawerNav', {
          screen: 'HomeBlank',
        });
      }
    }, 7000);

    return () => {
      backHandler.remove();  // Clean up back handler
      clearTimeout(timer);   // Clean up timer
    };
  }, [handleNav, navigation]);
};
