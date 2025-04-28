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

// import {orderStatus} from '../../../../Redux/Slice/Order/OrderSlice';
// import {globalStyle} from '../../../../utils/GlobalStyles';
// import {moderateScale, screenWidth} from '../../../Component/Matrix/Matrix';
// import {Images} from '../../../../utils/Images/Images';
// import CustomText from '../../../Component/Custom/CustomText';
// import Container from '../../../Component/Container';
// import OrderCard from '../../../Component/Cards/Order/OrderCard';
// import {userDetail} from '../../../../Redux/Slice/User/UserSlice';
// import {DEFAULT_URL, GET_STORE_SHOP} from '../../../../utils/API/api';
// import makeApiRequest from '../../../../utils/API/apiServices';
// import StoreOrderCard from '../../../Component/Cards/StoreOrderCard';
import Colors from '../../../utils/Colors';
import { orderStatus } from '../../../redux/Slice/OrderSlice';
import { globalStyle } from '../../../utils/GlobalStyle';
import { moderateScale, screenWidth } from '../../../components/Matrix/Matrix';
import CustomText from '../../../components/Customs/CustomText';
import Container from '../../../components/Container';
import OrderCard from '../../../components/Cards/OrderCard';
import makeApiRequest from '../../../utils/ApiService';
import { DEFAULT_URL, GET_STORE_SHOP } from '../../../utils/api';
import StoreOrderCard from '../../../components/Cards/StoreOrderCard';
import Images from '../../../utils/Images';

interface Props { }

const CompletedScreen: FC<Props> = ({ navigation }: any) => {
  const [couponCode, setCouponCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [typeOrder, setTypeOrder] = useState('Online');
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState<[]>([]);
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.user);
  const { data } = useSelector((state: any) => state.order);

  const { completed, processing } = data;

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

  // console.log('==== processing in the complete ====', processing);

  const OrderStatus = async () => {
    return await dispatch(orderStatus(user?.email));
  };

  useFocusEffect(
    useCallback(() => {
      OrderStatus();
    }, []),
  );
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response: any = await makeApiRequest({
          method: 'POST',
          url: GET_STORE_SHOP,
          baseUrl: DEFAULT_URL,
          data: {
            user_id: user?.id,
          },
        });

        console.log('=== response ===', response?.data);

        if (response?.status === 'success') setStoreData(response.data);
      } catch (error: any) {
        console.error('Error in the Store Order', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: moderateScale(10) }} >
      <View
        style={[
          globalStyle.row,
          {
            width: '100%',
            backgroundColor: '#f7f7f7',
            marginBottom: moderateScale(10),
            padding: moderateScale(5),
            borderRadius: moderateScale(8),
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            setTypeOrder('Online');
          }}
          style={[
            globalStyle.center,
            {
              flex: 1,
              backgroundColor:
                typeOrder === 'Online' ? Colors.gray_font : '#f7f7f7',
              padding: moderateScale(8),
              borderRadius: moderateScale(5),
              marginRight: moderateScale(2.5),
            },
          ]}>
          <CustomText
            text="Online"
            color={typeOrder === 'Online' ? '#fff' : '#000'}
            weight="500"
            size={18}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setTypeOrder('In-Store');
          }}
          style={[
            globalStyle.center,
            {
              flex: 1,
              backgroundColor:
                typeOrder === 'In-Store' ? Colors.gray_font : '#f7f7f7',
              padding: moderateScale(8),
              borderRadius: moderateScale(5),
              marginLeft: moderateScale(2.5),
            },
          ]}>
          <CustomText
            text="In-Store"
            color={typeOrder === 'In-Store' ? '#fff' : '#000'}
            weight="500"
            size={18}
          />
        </TouchableOpacity>
      </View>
      {typeOrder === 'Online' && completed.length > 0 ? (
        <FlatList
          data={completed}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item?.order_id}
          renderItem={({ item }) => {
            console.log('=== item in the completed ===', item);

            return (
              <OrderCard
                item={item}
                handleNavigation={() => {
                  navigation.navigate('CompletedOrderDetails', {
                    id: item?.order_id,
                    invoiceId: item?.invoices[0]?.invoice_id,
                  });
                }}
                btnName="Completed"
              />
            );
          }}
        />
      ) : typeOrder === 'In-Store' && storeData && storeData.length > 0 ? (
        <FlatList
          data={storeData}
          keyExtractor={(item: any) => item?.id}
          renderItem={({ item }) => <StoreOrderCard item={item} />}
        />
      ) : (
        <View style={[globalStyle.center, { flex: 1 }]}>
          <Images.Logo width={100} height={100} />
          <CustomText text="No data Available" weight="500" size={18} />
        </View>
      )}
    </View>
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

export default CompletedScreen;
