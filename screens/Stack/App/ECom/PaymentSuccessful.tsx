/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React from 'react';
import {
  View,
} from 'react-native';
import Container from '../../../../components/Container';
import CustomText from '../../../../components/Customs/CustomText';
import CustomIcon from '../../../../components/Customs/CustomIcon';
import { moderateScale} from '../../../../components/Matrix/Matrix';
import * as Animatable from 'react-native-animatable';
import { useBackHandler } from '../../../../utils/BackHandling';

const PaymentSuccessful= () => {

  useBackHandler('DrawerNav');

  return (
    <Container>
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          // direction="alternate"
        >
          <CustomIcon
            type="Feather"
            name="check-circle"
            size={70}
            color="#75cb72"
          />
        </Animatable.View>
        <CustomText
          text="Order Confirmed"
          weight="700"
          size={20}
          customStyle={{marginTop: moderateScale(10)}}
        />
        <CustomText text="Your order has been confirmed" weight="500" />
      </View>
    </Container>
  );
};


export default PaymentSuccessful;
