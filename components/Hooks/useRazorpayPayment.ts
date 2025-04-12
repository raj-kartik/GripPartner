import {useState} from 'react';
import Images from '../../utils/Images';
import makeApiRequest from '../../utils/ApiService';
import RazorpayCheckout from 'react-native-razorpay';
import {
  DEFAULT_URL,
  GENERATE_RAZORPAY_ORDER_ID,
  RAZORPAY_SECRET_KEY,
} from '../../utils/api';

const useRazorpayPayment = () => {
  const [PayLoading, setPayLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateOrderId = async (amount: number) => {
    setPayLoading(true);
    setError(null);
    try {
      const response: any = await makeApiRequest({
        url: GENERATE_RAZORPAY_ORDER_ID,
        method: 'POST',
        baseUrl: DEFAULT_URL,
        data: {amount},
      });
      return response?.id;
    } catch (err: any) {
      console.error('Error generating order ID:', err);
      setError(err);
      return null;
    } finally {
      setPayLoading(false);
    }
  };

  const processPayment = async (
    amount: number,
    profile: any,
    onSuccess: any,
    onFailure: any,
  ) => {
    const orderId = await generateOrderId(amount);
    if (!orderId) {
      onFailure && onFailure('Failed to generate order ID');
      return;
    }

    const options = {
      description: 'Order Payment',
      image: Images.LogoW,
      currency: 'INR',
      key: RAZORPAY_SECRET_KEY,
      order_id: orderId,
      name: 'GRIP',
      prefill: {
        email: profile?.email,
        contact: profile?.phone_number,
        name: `${profile?.first_name} ${profile?.last_name || ''}`,
      },
      theme: {color: '#000'},
    };

    try {
      const data = await RazorpayCheckout.open(options);
      onSuccess && onSuccess(data);
    } catch (err: any) {
      console.error(`Payment failed: ${err.code} | ${err.description}`);
      onFailure && onFailure(err);
    }
  };

  return {generateOrderId, processPayment, PayLoading, error};
};

export default useRazorpayPayment;
