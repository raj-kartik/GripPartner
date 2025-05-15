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
    useFocusEffect
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { moderateScale, screenWidth } from '../../../components/Matrix/Matrix';
import { orderStatus } from '../../../redux/Slice/OrderSlice';
import OrderCard from '../../../components/Cards/OrderCard';
import CustomText from '../../../components/Customs/CustomText';
import Images from '../../../utils/Images';
import { globalStyle } from '../../../utils/GlobalStyle';
import OrderSkeleton from '@components/Skeleton/OrderSkeleton';

interface Props {
    navigation: any
}

const ActiveScreen: FC<Props> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.user);
    const { data, loading } = useSelector((state: any) => state.order);
    const [refreshing, setRefreshing] = useState(false);
    const { pending } = data;

    // console.log("--- active screen ----",active);


    const OrderStatus = async () => {
        return await dispatch(orderStatus(user?.email));
    };

    useFocusEffect(
        useCallback(() => {
            OrderStatus();
        }, []),
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        OrderStatus().then(() => setRefreshing(false));
    }, []);

    return (
        <View style={{ backgroundColor: "#fff", paddingTop: moderateScale(10), flex: 1 }} >

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
                        {pending.length > 0 ? (
                            <FlatList
                                data={pending}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={['#000']}
                                        tintColor="#000"
                                    />
                                }
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item?.order_id}
                                renderItem={({ item }) => (
                                    <OrderCard
                                        item={item}
                                        handleNavigation={() => {
                                            navigation.navigate('OrderDetails', {
                                                id: item?.order_id,
                                                type: 'active',
                                                invoice: item?.invoices,
                                            });
                                        }}
                                    />
                                )}
                            />
                        ) : (
                            <View style={[globalStyle.center, { flex: 1 }]} >
                                <Images.Logo />
                                <CustomText
                                    text="No Data Available"
                                    weight="700"
                                    size={20}
                                    customStyle={{ flex: 1, alignSelf: 'center' }}
                                />
                            </View>
                        )}
                    </>
                )
            }
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

export default ActiveScreen;
