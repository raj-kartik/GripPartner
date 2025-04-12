import Toast from 'react-native-toast-message';
import Colors from '../../utils/Colors';


type ToastType = 'error' | 'info' | 'success';

interface CustomToastProps {
  type: ToastType;
  text1: string;
  text2: string;
}

export const CustomToast = ({type, text1, text2}: CustomToastProps) => {
  return Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    text1Style: {
      fontSize: 14,
      color:
        type === 'error'
          ? 'red'
          : type === 'info'
          ? Colors.button
          : Colors.success,
    },
    text2Style: {
      fontSize: 13,
      color: Colors.gray_font,
    },
  });
};
