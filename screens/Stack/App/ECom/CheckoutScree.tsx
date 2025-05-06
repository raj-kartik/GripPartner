import React, { useState, useCallback } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    View,
    Text,
    Pressable,
    FlatList,
} from 'react-native';
import { FieldArray, Formik } from 'formik';
import * as yup from 'yup';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import makeApiRequest from '../../../../utils/ApiService';
import {
    DEFAULT_URL,
    GET_COOUNTY_REGION_CODE,
    POST_ADD_SHIPPING_ADDRESS,
    POST_ADD_TO_CART_LIST,
} from '../../../../utils/api';
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix';
import CustomInput from '../../../../components/Customs/CustomInput';
import CustomButton from '../../../../components/Customs/CustomButton';
import CustomText from '../../../../components/Customs/CustomText';
import { globalStyle } from '../../../../utils/GlobalStyle';
import CustomToast  from '../../../../components/Customs/CustomToast';
import CustomIcon from '../../../../components/Customs/CustomIcon';
import CustomModal from '../../../../components/Customs/CustomModal';
import Colors from '../../../../utils/Colors';
import Container from '../../../../components/Container';

interface OrderItem {
    id: number;
    name: string;
    price: number;
    qty: number;
    product_type: string;
    image: string;
}

const shippingSchema = yup.object().shape({
    firstName: yup
        .string()
        .required('*required')
        .min(2, 'Too short')
        .max(30, 'Too long'),
    lastName: yup
        .string()
        .required('*required')
        .min(2, 'Too short')
        .max(30, 'Too long'),
    email: yup.string().required('*required').email('Invalid email'),
    mobile: yup
        .string()
        .required('*required')
        .matches(/^[0-9]{10}$/, 'Invalid number'),
    street: yup.string().required('*required').min(2, 'Too short'),
    city: yup.string().required('*required').min(2, 'Too short'),
    state: yup.object().required('*required'),
    pincode: yup
        .string()
        .required('*required')
        .matches(/^[0-9]{6}$/, 'Invalid pincode'),
    isBillSame: yup.boolean().required('*required'),

    // Conditional validation for billing fields
    billfirstName: yup.string().when('isBillSame', {
        is: false,
        then: schema =>
            schema.required('*required').min(2, 'Too short').max(30, 'Too long'),
        otherwise: schema => schema.notRequired(),
    }),
    billlastName: yup.string().when('isBillSame', {
        is: false,
        then: schema =>
            schema.required('*required').min(2, 'Too short').max(30, 'Too long'),
        otherwise: schema => schema.notRequired(),
    }),
    billemail: yup.string().when('isBillSame', {
        is: false,
        then: schema => schema.required('*required').email('Invalid email'),
        otherwise: schema => schema.notRequired(),
    }),
    billmobile: yup.string().when('isBillSame', {
        is: false,
        then: schema =>
            schema.required('*required').matches(/^[0-9]{10}$/, 'Invalid number'),
        otherwise: schema => schema.notRequired(),
    }),
    billstreet: yup.string().when('isBillSame', {
        is: false,
        then: schema => schema.required('*required').min(2, 'Too short'),
        otherwise: schema => schema.notRequired(),
    }),
    billcity: yup.string().when('isBillSame', {
        is: false,
        then: schema => schema.required('*required').min(2, 'Too short'),
        otherwise: schema => schema.notRequired(),
    }),
    billstate: yup.object().when('isBillSame', {
        is: false,
        then: schema => schema.required('State is required'),
        otherwise: schema => schema.notRequired(),
    }),
    billpincode: yup.string().when('isBillSame', {
        is: false,
        then: schema =>
            schema.required('*required').matches(/^[0-9]{6}$/, 'Invalid pincode'),
        otherwise: schema => schema.notRequired(),
    }),
});

const CheckoutScreen = () => {
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showmodal, setShowModal] = useState({ ship: false, bill: false });
    const [allItem, setAllItem] = useState([]);
    const [country, setCountry] = useState([]);
    const [itemBill, setItemsBill] = useState<OrderItem[]>([]);

    const { fullAddress, city, state, pincode } = useSelector(
        (state: any) => state.location,
    );
    const { user } = useSelector((state: any) => state.user);
    const userData = user;


    const getCartBill = async () => {
        try {
            const response: any = await makeApiRequest({
                url: POST_ADD_TO_CART_LIST,
                baseUrl: DEFAULT_URL,
                method: 'POST',
            });

            console.log('--- reponse in the add to cart---', response?.data);
            // return;

            if (!response.error) {
                setItemsBill(response?.data?.cart_items);
                setAllItem(response?.data);
            }
        } catch (er) {
            console.error('Error in the shopping cart: ', er);
        } finally {
            setLoading(false);
        }
    };


    const countryFunction = async () => {
        setLoading(true);
        try {
            const response: any = await makeApiRequest({
                baseUrl: DEFAULT_URL,
                method: 'GET',
                url: GET_COOUNTY_REGION_CODE,
            });

            if (!response.error) {
                setCountry(response.data?.available_regions);
            }
        } catch (error) {
            console.log(error, 'err');
        } finally {
            setLoading(false);
        }
    };

    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            countryFunction();
            getCartBill();
        }, []),
    );

    const handleShippingAddress = async (values: any) => {
        // console.log('==== values in the shiopping ====', values);
        // return;
        setLoading(true);


        try {
            const shipping_address: any = {
                country_id: 'IN',
                region: values?.state?.name,
                region_id: values?.state?.id,
                postcode: values?.pincode,
                city: values?.city,
                street: [values?.street],
                telephone: values?.mobile,
                firstname: values?.firstName,
                lastname: values?.lastName,
                email: values?.email,
            };

            const billing_address: any = values?.isBillSame
                ? shipping_address
                : {
                    country_id: 'IN',
                    region: values.billstate.name,
                    region_id: values?.billstate?.id,
                    postcode: values.billpincode,
                    city: values?.billcity,
                    street: [values?.billstreet],
                    telephone: values?.billmobile,
                    firstname: values?.billfirstName,
                    lastname: values?.billlastName,
                    email: values?.billemail,
                };

            const data = {
                shipping_address,
                billing_address,
                shipping_carrier_code: 'freeshipping',
                shipping_method_code: 'freeshipping',
            };

            const response: any = await makeApiRequest({
                baseUrl: DEFAULT_URL,
                url: POST_ADD_SHIPPING_ADDRESS,
                method: 'POST',
                data: data,
            });

            if (!response.error) {
                const parsing_data = {
                    billing_address: {
                        country_id: 'IN',
                        region_id: billing_address?.region_id,
                        postcode: billing_address?.postcode,
                        city: billing_address?.city,
                        street: [billing_address?.street],
                        telephone: billing_address?.telephone,
                        firstname: billing_address?.firstname,
                        lastname: billing_address?.lastname,
                        save_in_address_book: values?.isBillSame,
                    },
                    shipping_address: {
                        country_id: 'IN',
                        region_id: shipping_address.region_id,
                        postcode: shipping_address?.postcode,
                        city: shipping_address?.city,
                        street: [shipping_address?.street],
                        telephone: shipping_address?.telephone,
                        firstname: values?.firstName,
                        lastname: values?.lastName,
                        save_in_address_book: 1,
                        same_as_billing: values?.isBillSame,
                    },
                    email: values?.email,
                    shipping_carrier_code: 'freeshipping',
                    shipping_method_code: 'freeshipping',
                    payment_method: {
                        method: 'cashondelivery',
                    },
                };

                setAddress(parsing_data);
                CustomToast({
                    type: 'success',
                    text1: 'Address added successful',
                    text2: 'shipping and billing address have been saved',
                });
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'PaymentScreen',
                        params: {
                            // isChecked: isChecked,
                            placeOrder: address,
                            amount: allItem?.totals?.grand_total,
                        },
                    }),
                );
            }
        } catch (error) {
            console.error('Error in the posting shipping address: ', error);
            Toast.show({
                type: 'error',
                text1: 'Address added Unsuccessful',
                text2: 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    const renderForm = (
        values: any,
        errors: any,
        touched: any,
        handleChange: any,
        handleBlur: any,
        setFieldValue: any,
        prefix: any,
    ) => (
        <>
            <CustomInput
                text="First Name"
                placeholder="Jon"
                handleChangeText={handleChange(`${prefix}firstName`)}
                value={values[`${prefix}firstName`]}
            />
            {touched[`${prefix}firstName`] && errors[`${prefix}firstName`] && (
                <Text style={styles.error}>{errors[`${prefix}firstName`]}</Text>
            )}

            <CustomInput
                placeholder="Last Name"
                text="Last Name"
                handleChangeText={handleChange(`${prefix}lastName`)}
                value={values[`${prefix}lastName`]}
            />
            {touched[`${prefix}lastName`] && errors[`${prefix}lastName`] && (
                <Text style={styles.error}>{errors[`${prefix}lastName`]}</Text>
            )}

            <CustomInput
                text="Email"
                placeholder="jondoe@xyz.com"
                handleChangeText={handleChange(`${prefix}email`)}
                value={values[`${prefix}email`]}
            />
            {touched[`${prefix}email`] && errors[`${prefix}email`] && (
                <Text style={styles.error}>{errors[`${prefix}email`]}</Text>
            )}

            <CustomInput
                text="Mobile"
                placeholder="1234567890"
                keyboardType="numeric"
                handleChangeText={handleChange(`${prefix}mobile`)}
                maxLength={10}
                value={values[`${prefix}mobile`]}
            />
            {touched[`${prefix}mobile`] && errors[`${prefix}mobile`] && (
                <Text style={styles.error}>{errors[`${prefix}mobile`]}</Text>
            )}

            <CustomInput
                text="Street"
                placeholder="Street"
                handleChangeText={handleChange(`${prefix}street`)}
                value={values[`${prefix}street`]}
            />
            {touched[`${prefix}street`] && errors[`${prefix}street`] && (
                <Text style={styles.error}>{errors[`${prefix}street`]}</Text>
            )}

            <CustomInput
                placeholder="City"
                text="City"
                handleChangeText={handleChange(`${prefix}city`)}
                value={values[`${prefix}city`]}
            />
            {touched[`${prefix}city`] && errors[`${prefix}city`] && (
                <Text style={styles.error}>{errors[`${prefix}city`]}</Text>
            )}

            <View style={{ marginVertical: moderateScale(10) }}>
                <CustomText text="State" weight="500" size={14} />
                <Pressable
                    onPress={() => {
                        setShowModal(prev => ({
                            ship: prefix === '' ? true : false,
                            bill: prefix === '' ? false : true,
                        }));
                    }}
                    style={{
                        padding: moderateScale(15),
                        borderRadius: moderateScale(10),
                        elevation: 2,
                        backgroundColor: '#fff',
                    }}>
                    <CustomText
                        text={values[`${prefix}state`]?.name || 'State'}
                        color={!values[`${prefix}state`]?.name ? Colors.gray_font : '#000'}
                        size={14}
                    />
                </Pressable>
            </View>
            {touched[`${prefix}state`] && errors[`${prefix}state`] && (
                <Text style={styles.error}>{errors[`${prefix}state`]}</Text>
            )}

            <CustomInput
                placeholder="123456"
                text="Pincode"
                keyboardType="numeric"
                handleChangeText={handleChange(`${prefix}pincode`)}
                value={values[`${prefix}pincode`]}
                maxLength={6}
            />
            {touched[`${prefix}pincode`] && errors[`${prefix}pincode`] && (
                <Text style={styles.error}>{errors[`${prefix}pincode`]}</Text>
            )}

            {showmodal.ship && prefix === '' && (
                <CustomModal
                    iscenter={false}
                    onDismiss={() => {
                        setShowModal({ ship: false, bill: false });
                    }}
                    visible={showmodal.ship}
                    containerStyle={{
                        width: screenWidth,
                        backgroundColor: '#f7f7f7',
                        paddingVertical: moderateScale(15),
                        paddingHorizontal: moderateScale(10),
                    }}>
                    <View
                        style={[
                            globalStyle.betweenCenter,
                            { marginBottom: moderateScale(10) },
                        ]}>
                        <CustomText text="Select the State" weight="700" size={18} />
                        <Pressable
                            onPress={() => {
                                setShowModal({ ship: false, bill: false });
                            }}>
                            <CustomIcon type="Entypo" name="circle-with-cross" />
                        </Pressable>
                    </View>
                    <View
                        style={{
                            bottom: 0,
                            backgroundColor: '#f7f7f7',
                            paddingVertical: moderateScale(10),
                            height: screenHeight * 0.5,
                        }}>
                        <FlatList
                            data={country}
                            keyExtractor={(item: any) => item.id}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={{
                                        marginBottom: moderateScale(10),
                                        marginHorizontal: moderateScale(10),
                                        backgroundColor: '#fff',
                                        paddingVertical: moderateScale(15),
                                        paddingHorizontal: moderateScale(5),
                                        borderRadius: moderateScale(10),
                                    }}
                                    onPress={() => {
                                        setFieldValue(`${prefix}state`, item);
                                        console.log('Selected State:', item);
                                        setShowModal({ ship: false, bill: false });
                                    }}>
                                    <CustomText text={item?.name} />
                                </Pressable>
                            )}
                        />
                    </View>
                </CustomModal>
            )}

            {showmodal.bill && prefix === 'bill' && (
                <CustomModal
                    iscenter={false}
                    onDismiss={() => {
                        setShowModal({ ship: false, bill: false });
                    }}
                    visible={showmodal.bill}
                    containerStyle={{
                        width: screenWidth * 0.9,
                        backgroundColor: '#f7f7f7',
                        paddingVertical: moderateScale(15),
                        paddingHorizontal: moderateScale(10),
                    }}>
                    <View
                        style={[
                            globalStyle.betweenCenter,
                            { marginBottom: moderateScale(10) },
                        ]}>
                        <CustomText text="Select the State" weight="700" size={18} />
                        <Pressable
                            onPress={() => {
                                setShowModal({ ship: false, bill: false });
                            }}>
                            <CustomIcon type="Entypo" name="circle-with-cross" />
                        </Pressable>
                    </View>
                    <View
                        style={{
                            bottom: 0,
                            backgroundColor: '#f7f7f7',
                            paddingVertical: moderateScale(10),
                            height: screenHeight * 0.5,
                        }}>
                        <FlatList
                            data={country}
                            keyExtractor={(item: any) => item.id}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={{
                                        marginBottom: moderateScale(10),
                                        marginHorizontal: moderateScale(10),
                                        backgroundColor: '#fff',
                                        paddingVertical: moderateScale(15),
                                        paddingHorizontal: moderateScale(5),
                                        borderRadius: moderateScale(10),
                                    }}
                                    onPress={() => {
                                        setFieldValue(`${prefix}state`, item);
                                        console.log(' ---Selected State:', item);
                                        setShowModal({ ship: false, bill: false });
                                    }}>
                                    <CustomText text={item?.name} />
                                </Pressable>
                            )}
                        />
                    </View>
                </CustomModal>
            )}
        </>
    );

    return (
        <Container>
            {!loading ? (
                <KeyboardAvoidingView style={{ flex: 1 }}>
                    <ScrollView style={{ paddingHorizontal: moderateScale(10) }}>
                        <Formik
                            validationSchema={shippingSchema}
                            initialValues={{
                                firstName: userData?.first_name || '',
                                lastName: userData?.last_name || '',
                                email: userData?.email || '',
                                mobile: userData?.phone_number,
                                street: fullAddress || '',
                                city: city || '',
                                state: null,
                                pincode: pincode || '',
                                isBillSame: true,
                                billfirstName: userData?.first_name || '',
                                billlastName: userData?.last_name || '',
                                billemail: userData?.email || '',
                                billmobile: userData?.phone_number,
                                billstreet: '',
                                billcity: '',
                                billstate: null,
                                billpincode: '',
                            }}
                            onSubmit={values => {
                                handleShippingAddress(values);
                            }}>
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                setFieldValue,
                                values,
                                errors,
                                touched,
                            }) => (
                                <>
                                    <Text style={styles.heading}>Shipping Address</Text>
                                    {renderForm(
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        setFieldValue,
                                        '',
                                    )}
                                    <View
                                        style={[
                                            globalStyle.row,
                                            { marginVertical: moderateScale(20) },
                                        ]}>
                                        <Pressable
                                            onPress={() =>
                                                setFieldValue('isBillSame', !values.isBillSame)
                                            }
                                            style={[
                                                globalStyle.center,
                                                {
                                                    borderWidth: 2,
                                                    width: moderateScale(20),
                                                    height: moderateScale(20),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                },
                                            ]}>
                                            {values.isBillSame ? (
                                                <CustomIcon
                                                    type="MaterialCommunityIcons"
                                                    name="check-bold"
                                                    customStyle={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        right: 0,
                                                        left: 0,
                                                        overflow: 'visible',
                                                        zIndex: 9,
                                                    }}
                                                    size={22}
                                                />
                                            ) : null}
                                        </Pressable>
                                        <CustomText
                                            weight="500"
                                            customStyle={{ marginLeft: moderateScale(5) }}
                                            text="Billing address same as shipping address"
                                        />
                                    </View>

                                    {!values.isBillSame && (
                                        <>
                                            <Text style={styles.heading}>Billing Address</Text>
                                            {renderForm(
                                                values,
                                                errors,
                                                touched,
                                                handleChange,
                                                handleBlur,
                                                setFieldValue,
                                                'bill',
                                            )}
                                        </>
                                    )}
                                    <CustomButton
                                        customStyle={{ marginVertical: moderateScale(10) }}
                                        title="Submit"
                                        onPress={() => {
                                            console.log('--- errors showing platform ---', errors);
                                            handleSubmit();
                                        }}
                                    />
                                </>
                            )}
                        </Formik>
                    </ScrollView>
                </KeyboardAvoidingView>
            ) : (
                <ActivityIndicator color="#000" style={{ flex: 1 }} size="large" />
            )}
        </Container>
    );
};
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        fontSize: 12,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
});

export default CheckoutScreen;
