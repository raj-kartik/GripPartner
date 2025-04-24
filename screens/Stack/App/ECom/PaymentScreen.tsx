/* eslint-disable no-dupe-keys */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import { useState } from 'react';
import { FC } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import { useSelector } from 'react-redux';
import {
    DEFAULT_URL,
    GENERATE_RAZORPAY_ORDER_ID,
    POST_PLACE_ORDER,
    RAZORPAY_SECRET_KEY,
} from '../../../../utils/api';
import makeApiRequest from '../../../../utils/ApiService';
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix';
import CustomButton from '../../../../components/Customs/CustomButton';
import { CustomToast } from '../../../../components/Customs/CustomToast';
import Container from '../../../../components/Container';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import CustomText from '../../../../components/Customs/CustomText';
import { globalStyle } from '../../../../utils/GlobalStyle';
import Images from '../../../../utils/Images';
import Colors from '../../../../utils/Colors';
import CustomIcon from '../../../../components/Customs/CustomIcon';
interface Props {
    route: any;
}

const PaymentScreen: FC<Props> = ({ route }) => {
    const navigation = useNavigation();
    const { allAddress, isChecked, placeOrder, amount } = route.params;
    const [selectedValue, setSelectedValue] = useState('cod');
    const { user } = useSelector((state: any) => state.user);
    const profile = user;
    const [loading, setLoading] = useState<boolean>(false);

    const { data }: any = useSelector((state: any) => state?.wallet);
    const [isWallet, setIsWallet] = useState(false);

    // console.log('=== user ===', amount);

    const generateOrderid = async () => {
        try {
            const reponse: any = await makeApiRequest({
                url: GENERATE_RAZORPAY_ORDER_ID,
                method: 'POST',
                baseUrl: DEFAULT_URL,
                data: {
                    amount: isWallet && amount - data?.wallet_balance > 0 ? amount - data?.wallet_balance : amount - data?.wallet_balance <= 0 ? 0 : amount,
                },
            });

            // setOrderGenerateId(reponse);
            return reponse?.id;
        } catch (er) {
            console.log('error in generate order id :', er);
            return null;
        }
    };

    const Payment = async () => {
        const OrderPlace = async (paymentData: any = null) => {
            setLoading(true);
            const data = {
                ...placeOrder,
                paymentMethod: paymentData
                    ? {
                        method: 'razorpay',
                        additional_data: {
                            rzp_payment_id: paymentData?.razorpay_payment_id,
                            rzp_order_id: paymentData?.razorpay_order_id,
                            rzp_signature: paymentData?.razorpay_signature,
                        },
                    }
                    : { method: 'cashondelivery' },
                // wallet:
            };

            console.log('==== data in the payment ====', data);

            try {
                const response: any = await makeApiRequest({
                    baseUrl: DEFAULT_URL,
                    method: 'PUT',
                    url: POST_PLACE_ORDER,
                    data: data,
                });

                console.log('==== repsonse in the order place ===', response);

                if (!response.error) {
                    CustomToast({
                        type: 'success',
                        text1: 'Order Place Successful',
                        text2: 'Your order has been placed',
                    });
                    navigation.dispatch(
                        CommonActions.navigate({
                            name: 'PaymentSuccessful',
                        }),
                    );
                }
            } catch (error) {
                console.log('Error in placing order:', error);
                CustomToast({
                    type: 'error',
                    text1: 'Place Order Unsuccessful',
                    text2: 'Something went wrong',
                })
            } finally {
                setLoading(false);
            }
        };

        if (selectedValue === 'cod') {
            OrderPlace();
        } else {
            try {
                const orderGenerateId = await generateOrderid();
                if (!orderGenerateId) throw new Error('Failed to generate order ID');

                const options = {
                    description: 'Order Payment',
                    image: Images.Logo,
                    currency: 'INR',
                    key: RAZORPAY_SECRET_KEY,
                    order_id: orderGenerateId,
                    name: 'GRIP',
                    amount: isWallet && amount - data?.wallet_balance > 0 ? amount - data?.wallet_balance : amount - data?.wallet_balance <= 0 ? 0 : amount,
                    prefill: {
                        email: profile?.email,
                        contact: profile?.phone_number,
                        name: `${profile?.first_name} ${profile?.last_name || ''}`,
                    },
                    theme: { color: '#000' },
                };

                RazorpayCheckout.open(options)
                    .then((data: any) => {
                        OrderPlace(data);
                    })
                    .catch((error: any) => {
                        console.log(`Payment failed: ${error.code} | ${error.description}`);
                    });
            } catch (error) {
                console.error('Error generating Razorpay Order ID:', error);
            }
        }
    };

    const paymentMethod = [
        {
            id: 1,
            method: 'online',
            label: 'Credit Card/UPI',
        },
        {
            id: 2,
            method: 'cod',
            label: 'Cash On Delivery',
        },
    ];

    return (
        <Container>
            {loading ? (
                <ActivityIndicator color="#000" size="large" style={{ flex: 1 }} />
            ) : (
                <View style={{ flex: 1 }}>
                    <CustomHeader2 title="Payment Methods" />
                    <View
                        style={[
                            globalStyle.betweenCenter,
                            { marginVertical: moderateScale(10) },
                        ]}>
                        <CustomText
                            text="Select Your Payment Option"
                            customStyle={{ marginBottom: moderateScale(5) }}
                            size={16}
                            weight="600"
                        />
                        <CustomText text={`₹${isWallet && amount - data?.wallet_balance > 0 ? amount - data?.wallet_balance : amount - data?.wallet_balance <= 0 ? 0 : amount}`} size={20} weight="600" />
                    </View>

                    <View style={{ flex: 0.9 }}>
                        {paymentMethod.map(item => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setSelectedValue(item.method)}
                                key={item?.id}
                                style={[
                                    styles.methodBtn,
                                    globalStyle.row,
                                    {
                                        borderColor:
                                            selectedValue === item?.method
                                                ? Colors.activeRadio
                                                : Colors.lightGray,
                                        borderWidth: 1.5,
                                    },
                                ]}>
                                <CustomText
                                    customStyle={{ flex: 0.9 }}
                                    size={18}
                                    weight="500"
                                    text={item?.label}
                                />
                                <View style={[{ flex: 0.1, height: '100%' }, globalStyle.center]}>
                                    <View
                                        style={[
                                            {
                                                borderWidth: 2,
                                                width: moderateScale(25),
                                                height: moderateScale(25),
                                                borderRadius: moderateScale(100),
                                                borderColor:
                                                    selectedValue === item.method
                                                        ? Colors.activeRadio
                                                        : Colors.lightGray, // Change border color dynamically
                                            },
                                            globalStyle.center,
                                        ]}>
                                        <View
                                            style={{
                                                margin: moderateScale(5),
                                                backgroundColor:
                                                    selectedValue === item.method
                                                        ? Colors.activeRadio
                                                        : Colors.lightGray,
                                                width: moderateScale(15),
                                                height: moderateScale(15),
                                                borderRadius: moderateScale(100),
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ flex: 0.2 }}>
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
                                    text={`Wallet ₹${data?.wallet_balance || 0}`}
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
                        <CustomButton
                            title="Place Order"
                            onPress={() => {
                                Payment();
                            }}
                            customStyle={{ width: screenWidth * 0.95 }}
                        />
                    </View>
                </View>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    row: {
        // width: responsiveWidth(95),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 35,
        marginRight: 0,
        alignSelf: 'center',
    },
    text: {
        width: screenWidth * .9,
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
    },
    locationText: {
        width: screenWidth * .9,
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        textAlign: 'justify',
        alignSelf: 'center',
    },
    location: {
        width: screenWidth * .6,

        fontFamily: 'Roboto-Medium',
        fontSize: 14,
    },
    changeBtn: {
        backgroundColor: 'white',
        width: screenWidth * .25,
        height: screenHeight * .05,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'justify',
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 50,
        elevation: 2,
        opacity: 55,
    },
    changeBtnText: {
        width: screenWidth * .7,

        fontFamily: 'Roboto-Regular',
        fontSize: 14,
    },

    cart: {
        width: screenWidth * .9,
        height: screenHeight * .08,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'space-between',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 0.7,
        marginBottom: 20,
    },

    btn: {
        width: screenWidth * .9,
        height: screenHeight * .6,
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

    methodBtn: {
        width: '100%',
        height: moderateScale(80),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: moderateScale(10),
        padding: moderateScale(5),
        paddingHorizontal: moderateScale(8),
        backgroundColor: '#fff',
        justifyContent: 'center',
        // alignItems:'center'
    },
});

export default PaymentScreen;
