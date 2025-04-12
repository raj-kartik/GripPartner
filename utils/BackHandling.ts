import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export const useBackHandler = (screen: any = 'DrawerNav') => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // Navigate after 10 seconds
    const timer = setTimeout(() => {
      navigation.navigate(screen);
    }, 7000);

    return () => {
      backHandler.remove();
      clearTimeout(timer); // Clear the timer to prevent memory leaks
    };
  }, [navigation]);
};
