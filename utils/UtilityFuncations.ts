import { Alert, Linking } from 'react-native';
import makeApiRequest from './ApiService';

export const titleImpressionFunction = async (row: any) => {
  try {
    const response: any = await makeApiRequest({
      method: 'POST',
      url: 'tracking-site',
      data: row,
    });

    // console.log('response in the title impressions : ', response);
  } catch (err: any) {
    console.error('Error in the titleImpressionFunction function :', err);
  }
};

export const callPhoneNumber = (phoneNumber: any) => {
  const url = `tel:${phoneNumber}`;
  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Phone call not supported on this device');
      }
    })
    .catch(err => console.error('An error occurred', err));
};