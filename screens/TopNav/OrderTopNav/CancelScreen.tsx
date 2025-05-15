/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, { useCallback, useState } from 'react';
import { FC } from 'react';
import {
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  CommonActions,
  useFocusEffect
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomText from '../../../components/Customs/CustomText';
import { moderateScale, screenWidth } from '../../../components/Matrix/Matrix';
import Container from '../../../components/Container';
import OrderCard from '../../../components/Cards/OrderCard';
import { orderStatus } from '../../../redux/Slice/OrderSlice';
import Colors from '../../../utils/Colors';
import OrderSkeleton from '@components/Skeleton/OrderSkeleton';

interface Props { }

const CancelScreen: FC<Props> = ({ navigation }: any) => {
  const { data, loading } = useSelector((state: any) => state.order);
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  const [refreshing, setRefreshing] = useState(false);

  const { canceled } = data;

  const OrderStatus = async () => {
    return await dispatch(orderStatus(user?.email));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    OrderStatus().then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      OrderStatus();
    }, []),
  );

  return (
    <Container>

      {
        loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6]}
            keyExtractor={item => item}
            renderItem={() => (
              <OrderSkeleton />
            )}
          />
        ) : (
          <>
            {canceled.length > 0 ? (
              <FlatList
                data={canceled}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={Colors.orange}
                    colors={[Colors.orange]}
                    progressBackgroundColor="#fff"
                  />
                }
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
          </>
        )
      }

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
