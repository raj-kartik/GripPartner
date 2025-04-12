/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FC } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomText from '../../../components/Customs/CustomText';
import { moderateScale, screenWidth } from '../../../components/Matrix/Matrix';
import { globalStyle } from '../../../utils/GlobalStyle';
import Container from '../../../components/Container';
import OrderCard from '../../../components/Cards/OrderCard';
import { orderStatus } from '../../../redux/Slice/OrderSlice';

interface Props { }

const CancelScreen: FC<Props> = ({ navigation }: any) => {
  const [couponCode, setCouponCode] = useState('');
  const [applied, setApplied] = useState(false);
  const { data } = useSelector((state: any) => state.order);
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);

  const { canceled } = data;

  const OrderStatus = async () => {
    return await dispatch(orderStatus(user?.email));
  };

  useFocusEffect(
    useCallback(() => {
      OrderStatus();
    }, []),
  );

  const applyCoupon = () => {
    if (couponCode.trim() === '') {
      Alert.alert('Error', 'Please enter a valid coupon code.');
    } else {
      setApplied(true);
      Alert.alert('Success', `Coupon "${couponCode}" applied!`);
    }
  };

  const sentFun = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Description',
        // params: {
        //   franchiseid: id,
        // },
      }),
    );
  };

  return (
    <Container>
      {canceled.length > 0 ? (
        <FlatList
          data={canceled}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item?.order_id}
          renderItem={({ item }) => {
            // console.log('=== item in the cancel list ===', item);

            return (
              <OrderCard
                item={item}
                handleNavigation={() => {
                  navigation.navigate('OrderDetails', { id: item?.order_id });
                }}
                btnName="Cancelled"
              />
            );
          }}
        />
      ) : (
        <CustomText
          text="No Data Available"
          weight="700"
          size={20}
          customStyle={{ flex: 1, alignSelf: 'center' }}
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    height: screenWidth * 0.4,
    borderRadius: moderateScale(10),
    elevation: 5,
    marginBottom: moderateScale(5),
    backgroundColor: '#fff',
    marginTop: moderateScale(5),
  },
  img: {
    flex: 0.6,
    height: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    margin: moderateScale(5),
    alignSelf: 'center',
    borderRadius: moderateScale(10),
  },
  content: {
    flex: 1,
    paddingVertical: moderateScale(5),
  },
});

export default CancelScreen;
