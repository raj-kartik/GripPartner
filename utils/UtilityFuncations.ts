import {Alert, Linking} from 'react-native';
import makeApiRequest from './ApiService';
import {pick, types} from '@react-native-documents/picker';
import {
  BASE_URL,
  POST_COURSE_LEAD_CHANGE,
  POST_RETREAT_LEAD_CHANGE,
} from './api';
import {CustomToast} from '../components/Customs/CustomToast';

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

// uploadDocument
export const uploadDocument = async (
  allowMultiple: boolean,
  docType: string[],
) => {
  try {
    const result = await pick({
      mode: 'open',
      type: docType,
      allowMultiSelection: allowMultiple,
    });

    if (!result || result.length === 0) return [];

    const processedDocs = await Promise.all(
      result.map(async file => {
        return {
          ...file,
        };
      }),
    );

    return processedDocs;
  } catch (error) {
    console.warn('Document selection error:', error);
    return [];
  }
};

export const leadChangeStatus = async (
  typeOf: string,
  id: number,
  status: number,
) => {
  try {
    const response: any = await makeApiRequest({
      baseUrl: BASE_URL,
      url:
        typeOf === 'Course'
          ? POST_COURSE_LEAD_CHANGE
          : typeOf === 'Retreat'
          ? POST_RETREAT_LEAD_CHANGE
          : '',
      method: 'POST',
      data: {
        status: status,
        lead_id: id,
      },
    });

    if (response?.success) {
      CustomToast({
        type: 'success',
        text1: `${typeOf} lead has changed successful`,
        text2: response?.message || 'lead has been updated',
      });
      return true;
    } else {
      CustomToast({
        type: 'success',
        text1: `${typeOf} lead has changed successful`,
        text2: response?.message || 'lead has been updated',
      });
      return true;
    }
  } catch (err: any) {
    console.log('Error in the change status', err);
  }
};
