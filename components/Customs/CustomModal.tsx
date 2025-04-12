import React from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { moderateScale } from '../Matrix/Matrix';
import { globalStyle } from '../../utils/GlobalStyle';

interface CustomModalProps {
  visible: boolean;
  iscenter: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onDismiss,
  children,
  containerStyle,
  iscenter = true,
}) => {
  const theme = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}>
      <View style={[styles.overlay, iscenter ? globalStyle.center : { justifyContent: "flex-end" }]}>
        <TouchableOpacity
          onPress={onDismiss}
          activeOpacity={1}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.modalContainer, containerStyle]}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slow black color with transparency
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    width: '95%',
    maxWidth: 400,
    alignSelf: 'center',
    // marginHorizontal:moderateScale(10)
  },
});

export default CustomModal;
