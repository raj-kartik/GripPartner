import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import React, { useCallback, useState } from 'react';
import {
    NavigationContainer,
    useFocusEffect,
    useNavigation,
} from '@react-navigation/native';

//   import {
//     DEFAULT_URL,
//     GET_ORDER_DETAILS,
//     ORDER_INVOICE,
//     POST_CANCEL_ORDER,
//   } from '../../../../utils/API/api';
//   import Container from '../../../Component/Container';
//   import CustomHeader1 from '../../../Component/Custom/CustomHeader1';
//   import CustomText from '../../../Component/Custom/CustomText';
//   import {Images} from '../../../../utils/Images/Images';
//   import {moderateScale, screenWidth} from '../../../Component/Matrix/Matrix';
//   import {globalStyle} from '../../../../utils/GlobalStyles';
//   import colors from '../../../style/colors';
//   import CustomButton from '../../../Component/Custom/CustomButton';
//   import CustomModal from '../../../Component/Custom/CustomModal';
//   import {CustomToast} from '../../../Component/Custom/CustomToast';
import makeApiRequest from '../../../utils/ApiService';
import { DEFAULT_URL, GET_ORDER_DETAILS, ORDER_INVOICE, POST_CANCEL_ORDER } from '../../../utils/api';
import Container from '../../../components/Container';
import CustomHeader2 from '../../../components/Customs/Header/CustomHeader2';
import CustomText from '../../../components/Customs/CustomText';
import Images from '../../../utils/Images';
import { moderateScale, screenWidth } from '../../../components/Matrix/Matrix';
import { globalStyle } from '../../../utils/GlobalStyle';
import CustomButton from '../../../components/Customs/CustomButton';
import CustomModal from '../../../components/Customs/CustomModal';
import Colors from '../../../utils/Colors';
import CustomToast  from '../../../components/Customs/CustomToast';
const OrderDetails = (props: any) => {
    const params = props.route.params;
    const [details, setDetails] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [isModal, setIsModal] = useState<boolean>(false);
    const navigation = useNavigation();

    console.log('=== params ===', params);

    useFocusEffect(
        useCallback(() => {
            orderDetails();
        }, []),
    );

    const handleCancelOrder = async () => {
        try {
            setLoading(true);
            const response: any = await makeApiRequest({
                method: 'POST',
                url: POST_CANCEL_ORDER,
                baseUrl: DEFAULT_URL,
                data: {
                    order_id: params.id,
                },
            });
            if (!response.error) {
                CustomToast({
                    type: 'success',
                    text1: 'Order Cancelled Successfully',
                    text2: 'Your order has been cancelled',
                });
                setIsModal(false);
                navigation.goBack();
            }
        } catch (err) {
            console.log(err, 'error in cancel order');
        } finally {
            setLoading(false);
        }
    };

    const orderDetails = async () => {
        try {
            setLoading(true);
            const response: any = await makeApiRequest({
                method: 'POST',
                url: GET_ORDER_DETAILS,
                baseUrl: DEFAULT_URL,
                data: {
                    order_id: params.id,
                },
            });

            if (!response.error) setDetails(response.data);
        } catch (err) {
            console.log(err, 'error in order details');
        } finally {
            setLoading(false);
        }
    };

    const handleInvoice = async () => {
        try {
            const reponse = await makeApiRequest({
                baseUrl: DEFAULT_URL,
                url: ORDER_INVOICE,
                method: 'POST',
                data: {
                    order_id: params.id,
                },
            });
        } catch (err) {
            console.log('Error in the order: ', err);
        }
    };

    // console.log('=== params in the order details ===', params);
    const renderItem = ({ item }: any) => {
        return (
            <View style={[styles.itemContainer, globalStyle.flex]}>
                {item?.img ? (
                    <Image source={{ uri: item?.img }} style={styles.img} />
                ) : (
                    <View style={styles.img}>
                        <Images.Logo />
                    </View>
                )}
                <View style={styles.content}>
                    {item?.name.length > 50 ? (
                        <CustomText
                            text={item?.name.substr(0, 50) + '...'}
                            size={14}
                            weight="700"
                        />
                    ) : (
                        <CustomText text={item?.name} size={18} weight="700" />
                    )}

                    <View
                        style={[globalStyle.betweenCenter, { marginTop: moderateScale(5) }]}>
                        <CustomText
                            color={Colors.gray_font}
                            weight="500"
                            text={`Quantity ${item?.qty}`}
                        />
                        <CustomText
                            color={Colors.gray_font}
                            weight="500"
                            text={`₹${item?.row_total}`}
                        />
                    </View>
                </View>
            </View>
        );
    };

    return (
        <Container>
            <CustomHeader2 title="Order Details" />
            {!loading ? (
                <>
                    {details?.items && (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{ flex: 0.9 }}
                            data={details?.items}
                            keyExtractor={(item: any) => item?.sku}
                            renderItem={renderItem}
                        />
                    )}
                    <View style={{ flex: 0.1 }}>
                        {params.type === 'active' ? (
                            <CustomButton
                                title="Cancel Order"
                                onPress={() => {
                                    setIsModal(true);
                                }}
                            />
                        ) : null}
                    </View>

                    {isModal && (
                        <CustomModal
                            iscenter={false}
                            visible={isModal}
                            onDismiss={() => {
                                setIsModal(false);
                            }}
                            containerStyle={{
                                height: screenWidth * 0.4,
                            }}>
                            <CustomText
                                text="Cancel Order"
                                weight="600"
                                size={18}
                                customStyle={{ textAlign: 'center' }}
                            />
                            <View style={{ flex: 1 }}>
                                <View
                                    style={{
                                        marginTop: moderateScale(5),
                                        flex: 0.8,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <CustomText
                                        text="Are you sure you want to delete the order?"
                                        size={16}
                                        // weight='500'
                                        customStyle={{
                                            textAlign: 'center',
                                        }}
                                    />
                                </View>
                                <View
                                    style={[globalStyle.betweenCenter, { alignItems: 'flex-end' }]}>
                                    <CustomButton
                                        title="No"
                                        onPress={() => {
                                            setIsModal(false);
                                        }}
                                        customStyle={{ flex: 1 }}
                                    />
                                    <View style={{ marginHorizontal: moderateScale(5) }} />
                                    <CustomButton
                                        bg={Colors.red}
                                        title="Cancel"
                                        onPress={handleCancelOrder}
                                        customStyle={{ flex: 1 }}
                                    />
                                </View>
                            </View>
                        </CustomModal>
                    )}
                </>
            ) : (
                <ActivityIndicator color="#000" size="large" style={{ flex: 1 }} />
            )}
        </Container>
    );
};

export default OrderDetails;

const styles = StyleSheet.create({
    img: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        borderRadius: moderateScale(8),
    },
    itemContainer: {
        width: '100%',
        borderRadius: moderateScale(8),
        padding: moderateScale(5),
        backgroundColor: '#fff',
        elevation: 5,
        height: screenWidth * 0.4,
        borderWidth: 1,
        alignSelf: 'center',
        marginTop: moderateScale(10)
    },
    content: {
        flex: 0.6,
        marginHorizontal: moderateScale(10),
        // backgroundColor:"#000"
    },
});
