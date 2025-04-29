import {useEffect} from 'react';
import {OneSignal, LogLevel} from 'react-native-onesignal';
import {ONE_SIGNAL_SECRET_KEY} from '../../utils/api';

export const useOneSignal = () => {
  useEffect(()=>{
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(ONE_SIGNAL_SECRET_KEY);
    OneSignal.Notifications.requestPermission(true);
    OneSignal.Notifications.addEventListener('click', event => {
        console.log('OneSignal: notification clicked:', event);
    });
  },[])
};
