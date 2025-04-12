import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface APIRequestParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  contentType?: string;
  baseUrl?: string;
}

const API_BASE_URL = 'https://fitwithgrip.com/api/';

const handleError = (error: any): string => {
  if (error?.message === 'Network Error') {
    return 'No Internet Connection';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

const makeApiRequest = async <T>({
  method,
  url,
  data = null,
  headers = {},
  contentType = 'application/json',
  baseUrl = API_BASE_URL,
}: APIRequestParams): Promise<T> => {
  const isConnected = await NetInfo.fetch().then(state => state.isConnected);

  if (!isConnected) {
    throw new Error('No Internet Connection');
  }

  const finalHeaders: Record<string, string> = {
    'Content-Type': contentType,
    ...headers,
  };

  const tempToken = await AsyncStorage.getItem('token'); // Retrieve token directly

  if (tempToken) {
    try {
      // No JSON parsing needed because token is stored as a plain string
      finalHeaders['Authorization'] = `Bearer ${tempToken}`;
    } catch (error) {
      console.error('Error handling token:', error);
    }
  } else {
    console.warn('No user data found in AsyncStorage');
  }

  // console.log('--- Raw token data ---', finalHeaders);
  const requestOptions: RequestInit = {
    method,
    headers: finalHeaders,
    body: method === 'GET' ? undefined : JSON.stringify(data),
  };

  // console.log("---- request options ----",requestOptions);

  try {

    // console.log("=== URL ===",url);
    
    const response = await fetch(`${baseUrl}${url}`, requestOptions);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const responseData: T = await response.json();
    return responseData;
  } catch (error: any) {
    const errorMessage = handleError(error);
    console.error('API Error:', errorMessage, error);
    throw new Error(errorMessage);
  }
};

export default makeApiRequest;
