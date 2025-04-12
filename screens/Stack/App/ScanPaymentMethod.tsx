import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ToastAndroid
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import Container from '../../../components/Container';
import { CustomToast } from '../../../components/Customs/CustomToast';
import makeApiRequest from '../../../utils/ApiService';
import CustomText from '../../../components/Customs/CustomText';
import { moderateScale } from '../../../components/Matrix/Matrix';
import { globalStyle } from '../../../utils/GlobalStyle';
import CustomButton from '../../../components/Customs/CustomButton';
// import { userDetail } from '../../../redux/Slice/UserSlice/UserSlice';
import { getWalletBalance } from '../../../redux/Slice/WalletSlice';
import { BASE_URL, DEFAULT_URL, POST_APPLY_COUPON_STORE, POST_REMOVE_COUPON_STORE, POST_WALLET_IN_STORE, RAZORPAY_SECRET_KEY } from '../../../utils/api';
import CouponRedeem from '../../../components/Wallet/CouponRedeem';
import CustomIcon from '../../../components/Customs/CustomIcon';
import Colors from '../../../utils/Colors';

const ScanPaymentMethod = (props: any) => {
    // const params = props.route.params;
    const { item }: any = props.route.params;
    const { data }: any = useSelector((state: any) => state?.wallet);
    const { user }: any = useSelector((state: any) => state.user);
    const [isWallet, setIsWallet] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    // console.log('----- wallet kartik ----', item);
    const total = item?.reduce(
        (acc: number, curr: any) => acc + (curr?.total || 0),
        0,
    );

    const bank = data?.wallet_balance;


    useEffect(() => {
        const fetchWallet = async () => {
            setLoading(true);
            await dispatch(getWalletBalance(user?.id));
            setLoading(false);
        };

        fetchWallet();
    }, []);

    const walletRedeem = async () => {
        try {
            const response: any = await makeApiRequest({
                url: POST_WALLET_IN_STORE,
                method: 'POST',
                baseUrl: DEFAULT_URL,
                data: {
                    user_id: user?.id,
                    amount: data?.wallet_balance
                }
            })

            if (response.status) {
                // setIsWallet(true);
                await dispatch(getWalletBalance(user?.id));
                CustomToast({
                    type: 'success',
                    text1: 'Redeemed Successfully',
                    text2: 'Your wallet has been successfully redeemed.',
                });
                // dispatch(getWalletBalance(user?.id));
            }


        }
        catch (error: any) {
            console.log('Error in wallet redeem :', error);
        }
    }

    const [selectMethod, setSelectMethod] = useState('cash on delivery');

    const handlePayment = async () => {
        const userId = user?.id;

        if (selectMethod === 'cash on delivery') {
            if (!userId) {
                CustomToast({
                    type: 'error',
                    text1: 'User not found',
                    text2: 'Unable to process the scan.',
                });
                return;
            }


            const data: any = { user_id: userId, payment_method: 'cash on delivery', wallet: isWallet ? bank : 0, coupon_code: coupon };
            try {
                setLoading(true);
                const response: any = await makeApiRequest({
                    baseUrl: DEFAULT_URL,
                    url: 'store-api/place-order',
                    method: 'POST',
                    data: data,
                });
                console.log('---- response in the place order ---', response);
                if (response?.status === 'success') {
                    navigation.navigate('PaymentScan', { data: response?.data });
                    if (isWallet) {
                        walletRedeem();
                    }
                    CustomToast({
                        type: 'success',
                        text1: 'Order Place Successful',
                        text2: 'Your order have been placed',
                    });
                } else {
                    CustomToast({
                        type: 'error',
                        text1: 'Failed to Place Order',
                        text2: response?.message,
                    });
                }
            } catch (error) {
                console.log('Error in Scanning add to cart :', error);
                CustomToast({
                    type: 'error',
                    text1: 'Failed to Add',
                    text2: 'Unable to add the product to cart.',
                });
            } finally {
                setLoading(false);
            }

            return;
        } else if (selectMethod === 'online payment') {
            const options = {
                description: 'Payment for your order',
                //   image: Images.Logo,
                currency: 'INR',
                key: RAZORPAY_SECRET_KEY, // Replace with your Razorpay Key ID
                amount: !isWallet ? ((total - couponDiscount) * 100) : (total - data?.wallet_balance - couponDiscount) * 100, // Amount in paise (₹500)
                name: user?.data?.first_name,
                prefill: {
                    email: user?.email,
                    contact: user?.phone_number,
                    name: user?.first_name,
                },
                theme: { color: '#000' },
            };

            try {
                const data = await RazorpayCheckout.open(options);
                console.log(`Payment Success: ${data.razorpay_payment_id}`);

                // Proceed with placing an order after successful payment
                const userId = user?.id;
                const orderData = {
                    user_id: userId,
                    payment_method: 'online',
                    payment_id: data.razorpay_payment_id,
                    wallet: isWallet ? bank : 0,
                    coupon_code: coupon
                };
                const response: any = await makeApiRequest({
                    baseUrl: DEFAULT_URL,
                    url: 'store-api/place-order',
                    method: 'POST',
                    data: orderData,
                });

                if (response?.status === 'success') {
                    navigation.navigate('PaymentScan', { data: response?.data });
                }
            } catch (error: any) {
                console.log(`Payment Failed: ${error.code} | ${error.description}`);
                // alert('Payment Failed');
                CustomToast({
                    type: 'error',
                    text1: 'Failed to Place Order',
                    text2: 'Unable to place the order.',
                });
            }

            return;
        }
    };



    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;



    const handleApplyCoupon = async (couponCode: string) => {
        console.log("coupon code", couponCode);
        console.log("=== user id ===", user?.id);
        // setIsApplied(true);
        // setCoupon(couponCode);
        try {
            const response: any = await makeApiRequest({
                method: "POST",
                url: POST_APPLY_COUPON_STORE,
                baseUrl: DEFAULT_URL,
                data: {
                    user_id: user?.id,
                    coupon_code: couponCode.trim()
                }
            });

            console.log("response in the apply coupon", response);
            if (response?.status === 'success') {
                setCouponDiscount(response?.discount);
                setIsApplied(true);
                setCoupon(couponCode);
                ToastAndroid.show("Coupon Applied Successfully", ToastAndroid.SHORT);
            }

        }
        catch (error: any) {
            console.log("error in apply coupon", error);
        }
    };
    const handleRemoveCoupon = async (couponCode: string) => {
        // console.log("remove coupon code", couponCode);
        // setIsApplied(false);
        // setCoupon('');
        try {
            const response: any = await makeApiRequest({
                method: "POST",
                url: POST_REMOVE_COUPON_STORE,
                baseUrl: DEFAULT_URL,
                data: {
                    user_id: user?.id,
                }
            });

            console.log("response in the remove coupon", response);
            if (response?.status === 'success') {
                setCouponDiscount(0);
                setIsApplied(false);
                setCoupon('');
                ToastAndroid.show("Coupon Removed", ToastAndroid.SHORT);
            }
        }
        catch (error: any) {
            console.log("error in remove coupon", error);
        }
    }

    return (
        <Container>
            <View
                style={[
                    globalStyle.betweenCenter,
                    { marginVertical: moderateScale(10) },
                ]}>
                <CustomText
                    text="Select Payment Method"
                    size={18}
                    weight="600"
                // customStyle={{textAlign: 'center', marginTop: 10}}
                />
                <CustomText size={18} weight="600" text={`₹${!isWallet ? (total - couponDiscount) : data?.wallet_balance < total ? (total - data?.wallet_balance - couponDiscount) : 0}`} />
            </View>

            <View style={{ flex: 0.9 }}>
                <Pressable
                    disabled={bank >= total}
                    onPress={() => {
                        setSelectMethod('online payment');
                    }}
                    style={[
                        styles.pressBtn,
                        globalStyle.row,
                        {
                            borderColor: bank >= total ? "#ccc" : selectMethod === 'online payment' ? 'green' : '#000',
                            borderWidth: selectMethod === 'online payment' ? 1.5 : 1,
                        },
                    ]}>
                    <View style={{ flex: 0.9 }}>
                        <CustomText
                            customStyle={{}}
                            size={20}
                            weight="600"
                            color={selectMethod === 'online payment' ? 'green' : '#000'}
                            text="Credit Card/UPI"
                        />
                    </View>

                    <View style={[globalStyle.center, { flex: 0.1 }]}>
                        <View
                            style={[
                                globalStyle.center,
                                {
                                    width: moderateScale(20),
                                    height: moderateScale(20),
                                    borderRadius: moderateScale(50),
                                    borderColor:
                                        selectMethod === 'online payment' ? 'green' : '#000',
                                    borderWidth: selectMethod === 'online payment' ? 1.5 : 1,
                                },
                            ]}>
                            <View
                                style={{
                                    width: moderateScale(12),
                                    height: moderateScale(12),
                                    borderRadius: moderateScale(50),
                                    backgroundColor:
                                        selectMethod === 'online payment' ? 'green' : '#000',
                                    // borderWidth: selectMethod === 'cash on delivery' ? 1.5 : 1,
                                    margin: moderateScale(5),
                                }}
                            />
                        </View>
                    </View>
                </Pressable>

                {/* cash on delivery */}
                <Pressable
                    onPress={() => {
                        setSelectMethod('cash on delivery');
                    }}
                    style={[
                        styles.pressBtn,
                        globalStyle.row,
                        {
                            borderColor:
                                selectMethod === 'cash on delivery' ? 'green' : '#000',
                            borderWidth: selectMethod === 'cash on delivery' ? 1.5 : 1,
                        },
                    ]}>
                    <View style={{ flex: 0.9 }}>
                        <CustomText
                            customStyle={{}}
                            size={20}
                            weight="600"
                            text="Cash On Delivery"
                            color={selectMethod === 'cash on delivery' ? 'green' : '#000'}
                        />
                    </View>

                    <View style={[globalStyle.center, { flex: 0.1 }]}>
                        <View
                            style={[
                                globalStyle.center,
                                {
                                    width: moderateScale(20),
                                    height: moderateScale(20),
                                    borderRadius: moderateScale(50),
                                    borderColor:
                                        selectMethod === 'cash on delivery' ? 'green' : '#000',
                                    borderWidth: selectMethod === 'cash on delivery' ? 1.5 : 1,
                                },
                            ]}>
                            <View
                                style={{
                                    width: moderateScale(12),
                                    height: moderateScale(12),
                                    borderRadius: moderateScale(50),
                                    backgroundColor:
                                        selectMethod === 'cash on delivery' ? 'green' : '#000',
                                    // borderWidth: selectMethod === 'cash on delivery' ? 1.5 : 1,
                                    margin: moderateScale(5),
                                }}
                            />
                        </View>
                    </View>
                </Pressable>
            </View>

            <CouponRedeem handleApplyCoupon={(couponCode: string) => handleApplyCoupon(couponCode)} isApplied={isApplied} handleRemoveCoupon={(couponCode: string) => handleRemoveCoupon(couponCode)} />

            {/* order button */}
            <View style={{ flex: 0.15, marginBottom: moderateScale(20) }}>
                <Pressable
                    onPress={() => {
                        // walletRedeem();
                        if (data?.wallet_balance) {
                            setIsWallet(!isWallet);
                        }
                        else {
                            CustomToast({
                                type: 'error',
                                text1: 'Insufficient Wallet Balance',
                                text2: 'Please add money to your wallet to proceed with this order.',
                            })
                        }
                    }}
                    style={[
                        globalStyle.betweenCenter,
                        {
                            marginBottom: moderateScale(10),
                            borderWidth: 1,
                            borderColor: '#909090',
                            padding: moderateScale(5),
                            borderRadius: moderateScale(5),
                            paddingVertical: moderateScale(8),
                            backgroundColor: '#f7f7f7',
                        },
                    ]}>
                    <View style={[globalStyle.row]}>
                        <CustomIcon
                            type="Entypo"
                            name="wallet"
                            color={Colors.orange}
                            size={26}
                        />
                        <CustomText
                            text={`Wallet ₹${data?.wallet_balance}`}
                            customStyle={{ marginLeft: moderateScale(5) }}
                            size={19}
                            weight="600"
                        />
                    </View>
                    <View
                        style={[
                            globalStyle.center,
                            {
                                paddingHorizontal: moderateScale(3),
                                borderWidth: 2,
                                borderColor: Colors.orange,
                                width: moderateScale(25),
                                height: moderateScale(25),
                            },
                        ]}>
                        {isWallet && <CustomIcon type="Octicons" name="check" size={20} />}
                    </View>
                </Pressable>
                <CustomButton title="Submit" onPress={handlePayment} />
            </View>
        </Container>
    );
};

export default ScanPaymentMethod;

const styles = StyleSheet.create({
    pressBtn: {
        width: '100%',
        height: moderateScale(100),
        backgroundColor: '#fff',
        // borderColor: '#000',
        borderRadius: moderateScale(10),
        marginTop: moderateScale(10),
        padding: moderateScale(10),
    },
});
