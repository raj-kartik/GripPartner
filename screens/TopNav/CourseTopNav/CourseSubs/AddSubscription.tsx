import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../../../../components/Container'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { Formik } from 'formik'
import CustomButton from '../../../../components/Customs/CustomButton'
import CustomInput from '../../../../components/Customs/CustomInput'
import CalendarPicker from 'react-native-calendar-picker';
import { moderateScale } from '../../../../components/Matrix/Matrix'
import { Dropdown } from 'react-native-element-dropdown'
import Colors from '../../../../utils/Colors'
import CustomText from '../../../../components/Customs/CustomText'
import makeApiRequest from '../../../../utils/ApiService'
import { BASE_URL } from '../../../../utils/api'
import { CustomToast } from '../../../../components/Customs/CustomToast'

const addSubsSchema = Yup.object().shape({
    isPaid: Yup.string().required('*required'),
    fees: Yup.number().integer().required('*required'),
    paymentDate: Yup.date().when('isPaid', {
        is: true,
        then: (schema) => schema.required('*required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    subscriptionDate: Yup.date().required('*required'),
});

const AddSubscription = () => {
    const route: any = useRoute();
    const { lead_id } = route.params;
    const [isCalendar, setIsCalendar] = useState({
        payment: false,
        subs: false
    });
    const navigation = useNavigation();

    const data = [
        { label: 'Paid', values: 'paid' },
        { label: 'Unpaid', values: 'unpaid' },
    ];

    return (
        <Container>
            <CustomHeader2 title="Add Subscriber" />
            <Formik
                initialValues={{
                    isPaid: '',
                    fees: '',
                    paymentDate: '',
                    subscriptionDate: ''
                }}
                validationSchema={addSubsSchema}
                onSubmit={async (values) => {

                    const row = {
                        id: lead_id,
                        fee: values?.fees,
                        feeType: values?.isPaid,
                        fee_date: values?.paymentDate || "",
                        status: 2,
                    };
                    try {
                        const response: any = await makeApiRequest({
                            baseUrl: BASE_URL,
                            url: "leadto-suscription",
                            method: "POST",
                            data: row
                        });

                        console.log("---- response in the add subscription -----", response);


                        if (response?.success === true) {
                            CustomToast({
                                type: "success",
                                text1: "Add to Subscriber Successfully",
                                text2: "added as student"
                            });

                            navigation.dispatch(
                                CommonActions.navigate({
                                    name: 'CourseTopNav',
                                    params: {
                                        courseid: null,
                                        screen: 'CourseSubs',
                                    },
                                }),
                            );


                        }
                        // console.log("==== response in the add subs scription ====", response);

                    }
                    catch (err: any) {
                        console.log("Error in the add subscription:", err);

                    }
                    // console.log("=== values in the subscription ===", values);
                }}
            >
                {({ handleChange, errors, touched, values, setFieldError, setFieldTouched, setFieldValue, handleSubmit }: any) => {

                    // console.log("=== values in add subscription ===", values?.isPaid);

                    useEffect(() => {
                        console.log("=== error in the add subscription ===", errors);

                    }, [errors])
                    return (
                        <KeyboardAvoidingView style={{ flex: 1 }} >
                            <ScrollView style={{ flex: .9, paddingHorizontal: moderateScale(5) }} >
                                <CustomInput text='Entry Fee' keyboardType='numeric' handleChangeText={handleChange('fees')} />

                                <View style={{ marginTop: moderateScale(10) }} >
                                    <CustomText text='Select Pay' weight='500' size={15} />
                                    <Dropdown
                                        data={data}
                                        value={values?.isPaid}
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        placeholder='Select payment type'
                                        labelField="label"
                                        valueField="values"  // keep this
                                        search={false}
                                        onChange={item => {
                                            setFieldValue('isPaid', item?.values);  // <-- fix here
                                        }}
                                    />

                                </View>

                                {
                                    values?.isPaid === 'paid' && <View style={{ marginTop: moderateScale(10) }} >
                                        <CustomText text='Payment Date' weight='500' size={15} />
                                        <Pressable
                                            style={[
                                                styles.inputContainer,
                                                {
                                                    borderWidth: touched.type ? 1 : 0,
                                                    borderColor: touched.type ? '#000' : '#fff',
                                                },
                                            ]}
                                            onPress={() => {
                                                setIsCalendar({
                                                    payment: !isCalendar.payment,
                                                    subs: false,
                                                });
                                            }}>
                                            <CustomText
                                                text={values.paymentDate ? values.paymentDate : 'Select Payment Date'}
                                                color={values.paymentDate ? '#000' : '#909090'}
                                                weight="400"
                                                size={15}
                                            />
                                        </Pressable>
                                    </View>
                                }


                                <View style={{ marginTop: moderateScale(10) }}>
                                    {isCalendar.payment && (
                                        <CalendarPicker
                                            onDateChange={(date: any) => {

                                                // console.log("=== date in the end ===",date);

                                                const formattedDate = new Date(
                                                    date,
                                                ).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })
                                                    .split('/')
                                                    .reverse()
                                                    .join('-');

                                                setFieldValue('paymentDate', formattedDate.replaceAll('/', '-'));
                                                setIsCalendar({
                                                    payment: false,
                                                    subs: false,
                                                });
                                            }}
                                        />
                                    )}
                                </View>

                                <View style={{ marginTop: moderateScale(10) }} >
                                    <CustomText text='Subscription Date' weight='500' size={15} />
                                    <Pressable
                                        style={[
                                            styles.inputContainer,
                                            {
                                                borderWidth: touched.type ? 1 : 0,
                                                borderColor: touched.type ? '#000' : '#fff',
                                            },
                                        ]}
                                        onPress={() => {
                                            setIsCalendar({
                                                subs: !isCalendar.payment,
                                                payment: false,
                                            });
                                        }}>
                                        <CustomText
                                            text={values?.subscriptionDate ? values?.subscriptionDate : 'Select Payment Date'}
                                            color={values?.subscriptionDate ? '#000' : '#909090'}
                                            weight="400"
                                            size={15}
                                        />
                                    </Pressable>
                                </View>

                                <View style={{ marginTop: moderateScale(10) }}>
                                    {isCalendar.subs && (
                                        <CalendarPicker
                                            onDateChange={(date: any) => {
                                                const formattedDate = new Date(
                                                    date,
                                                ).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                }).split('/')
                                                    .reverse()
                                                    .join('-');

                                                setFieldValue('subscriptionDate', formattedDate.replaceAll('/', '-'));
                                                setIsCalendar({
                                                    payment: false,
                                                    subs: false,
                                                });
                                            }}
                                        />
                                    )}
                                </View>

                            </ScrollView>
                            <View style={{ flex: .1 }} >
                                <CustomButton title='Submit' onPress={handleSubmit} />
                            </View>
                        </KeyboardAvoidingView>
                    )
                }}

            </Formik>
        </Container>
    )
}

export default AddSubscription

const styles = StyleSheet.create({
    inputContainer: {
        width: '98%',
        alignSelf: 'center',
        paddingVertical: moderateScale(15),
        borderRadius: moderateScale(8),
        borderWidth: 1,
        paddingHorizontal: moderateScale(10),
        marginTop: moderateScale(3),
        elevation: 2,
        backgroundColor: '#fff',
    },
    selectedTextStyle: {
        color: '#000',
        fontWeight: '500',
        fontSize: 14,
    },
    inputSearchStyle: {
        color: '#000',
        backgroundColor: '#fff',
    },
    selectedStyle: {
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        flexDirection: 'row',
    },
    dropdown: {
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Colors.gray_font,
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(8),
        // marginTop: moderateScale(15),
        paddingVertical: moderateScale(8),
        backgroundColor: '#fff',
        height: moderateScale(50)
    },
    placeholderStyle: {
        color: Colors.gray_font,
    },
})