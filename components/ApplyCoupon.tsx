/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { JSX, useEffect, useState } from 'react';
import { FC } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import axios from 'axios';
import CustomText from './Customs/CustomText';
import CustomInput from './Customs/CustomInput';
import { globalStyle } from '../utils/GlobalStyle';
import CustomButton from './Customs/CustomButton';
import { moderateScale, screenHeight, screenWidth } from './Matrix/Matrix';
import { DEFAULT_URL, POST_APPLY_COUPON } from '../utils/api';
import CustomToast from './Customs/CustomToast';
import Colors from '../utils/Colors';

interface Props {
    navigation: any;
    itemBill: any
}

const ApplyCoupon: FC<Props> = ({ itemBill, navigation }): JSX.Element => {
    const [couponCode, setCouponCode] = useState('');
    const [localItemBill, setLocalItemBill] = useState(itemBill); // Local state for instant updates
    const [isCoupon, setIsCoupon] = useState(false);
    useEffect(() => {
        // Sync localItemBill with the itemBill prop
        setLocalItemBill(itemBill);
    }, [itemBill]);

    const applyCoupon = async () => {
        try {
            const formData = new FormData();
            formData.append('coupon_code', couponCode);

            // setLoading(true);

            const response = await axios.post(
                `${DEFAULT_URL}${POST_APPLY_COUPON}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );
            if (response.data.error) {
                CustomToast({
                    type: 'error',
                    text1: 'Invalid Coupon Code',
                    text2: 'Please re-try again',
                });
                setCouponCode('');
            } else {
                CustomToast({
                    type: 'success',
                    text1: 'Coupon Applied Sucessfully',
                    text2: '',
                });
                const updateBill = {
                    ...localItemBill,
                    totals: {
                        coupon_discount: response?.data?.data?.coupon_discount,
                        subtotal: response?.data?.data?.subtotal,
                        grand_total: response?.data?.data?.total,
                    },
                };
                setLocalItemBill(updateBill);
                setIsCoupon(true);
            }

            // setCouponCode('');
        } catch (err: any) {
            console.log('Error in the Apply Coupon', err);
        }
    };

    const deleteCoupon = async () => {
        const url = `shop/remove-coupon?coupon_code=${couponCode}`;
        try {
            // setLoading(true);
            const formData = new FormData();
            formData.append('coupon_code', couponCode);

            const response: any = await axios.post(`${DEFAULT_URL}${url}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const data = response?.data;

            if (!response?.error) {
                const updateBill = {
                    ...localItemBill,
                    totals: {
                        coupon_discount: data.data?.coupon_discount,
                        subtotal: data.data?.subtotal,
                        grand_total: data.data?.total,
                    },
                };

                console.log('==== updatebill ====', updateBill);
                setIsCoupon(false);
                setCouponCode('');
                setLocalItemBill(updateBill);
                setIsCoupon(false);
            }
        } catch (err) {
            console.error('Error in the Deleting the coupon:', err);
        }
    };

    const sentFun = () => {
        navigation.dispatch(
            CommonActions.navigate({
                name: 'CheckoutScreen',
            }),
        );
    };

    return (
        <View style={styles.cover}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ marginTop: moderateScale(20) }}
                showsVerticalScrollIndicator={false}>
                <CustomText text="Apply Coupon" weight="600" size={16} />
                <View
                    style={[
                        globalStyle.row,
                        {
                            marginBottom: moderateScale(10),
                            alignItems: 'center',
                            marginTop: moderateScale(5),
                            // width: screenWidth * 0.9,
                        },
                    ]}>
                    <CustomInput
                        placeholder="Enter coupon code"
                        editable={!isCoupon}
                        autoCapitalize='characters'
                        textColor={isCoupon ? '#808080' : '#000'}
                        customStyle={{
                            flex: 1,
                            marginRight: moderateScale(10),
                            marginTop: 2,
                        }}
                        value={couponCode}
                        handleChangeText={setCouponCode}
                    />
                    <View style={{ flex: .6 }} >
                        {!isCoupon ? (
                            <CustomButton
                                title="Apply"
                                // customStyle={{ flex: 0.5, margin: 0, width: "45%" }}

                                onPress={() => {
                                    if (couponCode) {
                                        applyCoupon();
                                    } else {
                                        CustomToast({
                                            type: 'info',
                                            text1: 'Invalid Coupon Code',
                                            text2: 'Please add coupon code',
                                        });
                                    }
                                }}
                            />
                        ) : (
                            <CustomButton
                                // customStyle={{ flex: 0.5, margin: 0, width: "45%" }} 
                                title="Cancel" bg="red" onPress={deleteCoupon}
                            />
                        )}
                    </View>
                </View>
                {isCoupon && (
                    <CustomText text="Coupon Applied" color="#55b910" weight="500" />
                )}

                {/* Payment Details */}
                <View style={styles.paymentContainer}>
                    <CustomText
                        text="Payment Details"
                        customStyle={{ marginVertical: moderateScale(10) }}
                        weight="600"
                        size={16}
                    />
                    <View style={styles.paymentRow}>
                        <CustomText text="Sub Total" weight="500" size={14} />
                        <CustomText
                            size={14}
                            weight="500"
                            text={`₹${localItemBill?.totals?.subtotal || 0.0}`}
                        />
                    </View>
                    <View style={styles.paymentRow}>
                        <CustomText text="Discount" weight="500" size={14} />
                        <CustomText
                            size={14}
                            weight="500"
                            text={`₹${localItemBill?.totals?.coupon_discount || 0.0}`}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.paymentRow}>
                        <CustomText text="Total" weight="600" size={18} />
                        <CustomText
                            size={18}
                            weight="600"
                            text={`₹${localItemBill?.totals?.grand_total || 0.0}`}
                        />
                    </View>
                </View>
                <CustomButton
                    customStyle={{ marginTop: moderateScale(10) }}
                    title="Proceed to Checkout"
                    onPress={sentFun}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    cover: {
        width: screenWidth,
        backgroundColor: Colors.white,
        borderRadius: moderateScale(40),
        marginTop: moderateScale(0),
        alignSelf: 'center',
        paddingTop: moderateScale(10),
        padding: moderateScale(10),
        flex: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    couponContainer: {
        width: screenWidth * .9,

        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    couponInput: {
        width: screenWidth * .7,
        height: screenHeight * .05,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        elevation: 1,
        marginLeft: 1,
        position: 'relative',
        zIndex: -5,
        borderColor: 'white',
    },
    applyButton: {
        width: screenWidth * .15,
        // height: responsiveHeight(7.5),
        backgroundColor: 'black',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    applyText: {
        color: 'white',
        fontWeight: 'bold',
    },
    successText: {
        color: 'green',
        fontSize: 18,
        marginBottom: 20,
    },
    paymentContainer: {
        marginTop: 10,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    paymentText: {
        fontSize: 18,
        color: 'black',
    },
    paymentValue: {
        fontSize: 18,
        color: 'black',
    },
    totalText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    totalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    divider: {
        height: 1,
        backgroundColor: 'lightgray',
        marginVertical: 10,
    },

    btn: {
        width: screenWidth * .85,
        height: screenHeight * .06,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 80,
        borderRadius: 50,
        alignSelf: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageWithIconContainer: {
        flexDirection: 'row',
        gap: 0,
        marginTop: -5,
        marginBottom: 55,
    },

    emptyCartImage: {
        width: screenWidth * .23,
        height: screenHeight * .15,
        resizeMode: 'contain',
        borderTopRightRadius: 50,
        position: 'absolute',
        zIndex: -55,
    },

    plusIcon: {
        marginLeft: 55.5, // Space between image and plus icon,
        marginTop: 2.2,
        position: 'relative',

        zIndex: 999,
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
    },

    emptyCartText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 10,
    },

    emptyCartSubText: {
        fontSize: 15,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Roboto-Regular',
    },

    shopNowButton: {
        backgroundColor: 'black',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },

    shopNowText: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ApplyCoupon;
