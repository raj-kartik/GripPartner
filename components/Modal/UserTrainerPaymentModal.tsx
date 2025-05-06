import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { moderateScale, screenHeight } from '../Matrix/Matrix';
import CustomModal from '../Customs/CustomModal';
import CustomToast  from '../Customs/CustomToast';
import { globalStyle } from '../../utils/GlobalStyle';
import Colors from '../../utils/Colors';
import CustomText from '../Customs/CustomText';
import CustomButton from '../Customs/CustomButton';

const UserTrainerPaymentModal = ({
  data,
  transactionModal,
  settransactionModal,
  bankData,
  handlePayment,
  isRedeemWallet,
  setIsRedeemWallet,
  price
}: any) => {
  // const [isRedeemWallet, setIsRedeemWallet] = useState(false);

  return (
    <CustomModal
      containerStyle={{
        width: '100%',
        height: screenHeight * 0.2,
        paddingTop: moderateScale(20),
      }}
      iscenter={false}
      visible={transactionModal}
      onDismiss={() => {
        settransactionModal(false);
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (bankData == 0) {
            CustomToast({
              type: 'info',
              text1: 'Please add money to your wallet to proceed.',
              text2: '',
            });
          } else {
            setIsRedeemWallet(!isRedeemWallet);
          }
        }}
        style={[
          globalStyle.betweenCenter,
          {
            borderWidth: 1.5,
            borderColor: '#ccc',
            paddingVertical: moderateScale(15),
            paddingHorizontal: moderateScale(5),
            borderRadius: moderateScale(5),
            marginBottom: moderateScale(10),
            backgroundColor: isRedeemWallet ? Colors.activeBlur : '#fff',
          },
        ]}>
        <CustomText weight="600" size={18} text="Redeem Wallet" />
        <CustomText
          weight="500"
          size={18}
          text={`₹${bankData?.wallet_balance}`}
        />
      </TouchableOpacity>
      <CustomButton
        title={
          'Pay Online' +
          ' ' +
          `₹${isRedeemWallet
            ? price - bankData?.wallet_balance
            : price
          }`
        }
        onPress={() => {
          const amount = isRedeemWallet
            ? price - bankData?.wallet_balance
            : price;
          if (bankData.wallet_balance < price) {
            handlePayment(amount);
          }
        }}
      />
    </CustomModal>
  );
};

export default UserTrainerPaymentModal;

const styles = StyleSheet.create({});
