import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Container from '../../../../components/Container'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import CustomInput from '../../../../components/Customs/CustomInput'
import * as yup from 'yup'
import { Formik, setNestedObjectValues } from 'formik'
import { moderateScale, screenHeight } from '../../../../components/Matrix/Matrix'
import { CommonActions, useNavigation } from '@react-navigation/native'
import CustomButton from '../../../../components/Customs/CustomButton'
import CalendarPicker from 'react-native-calendar-picker';
import CustomText from '../../../../components/Customs/CustomText'
import Colors from '../../../../utils/Colors'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown'
import CustomIcon from '../../../../components/Customs/CustomIcon'
import makeApiRequest from '../../../../utils/ApiService'
import { BASE_URL } from '../../../../utils/api'
import { CustomToast } from '../../../../components/Customs/CustomToast'

const bookingSchema = yup.object().shape({
    room_type: yup.array()
        .of(yup.string().min(1, '*room name required'))
        .min(1, '*At least one room is required')
        .required('*required'),
    payment_type: yup.string().required('*required'),
    group_size: yup.number().positive().integer().required('*required'),
    bookingFee: yup.number().positive().required('*required'),
    // img: yup.mixed(),
    booking_date: yup.date().required('*Start date is required'),
    fee_date: yup.date()
        .required('*Fee is required')
        .min(
            yup.ref('booking_date'),
            '*Fee date cannot be before start date'
        ),
});


const AddBookingScreen = ({ route }: any) => {
    const [loading, setLoading] = useState(false)
    const { lead_id } = route.params;
    const navigation = useNavigation();
    const [isCalendar, setIsCalendar] = useState({
        fee: false,
        book: false
    })

    const data = [
        { label: 'Paid', values: 'paid' },
        { label: 'Unpaid', values: 'unpaid' },
    ];

    const roomTypeData = [
        { label: 'Double Room (Private)', value: 'Double Room (Private)' },
        { label: 'Double Room (Sharing)', value: 'Double Room (Sharing)' },
        { label: 'Triple Room (Private)', value: 'Triple Room (Private)' },
        { label: 'Triple Room (Sharing)', value: 'Triple Room (Sharing)' },
    ];

    const handleBooking = async (values: any) => {
        setLoading(true);
        try {
            const row = {
                lead_id: lead_id,
                room_type: values?.room_type.join(''),
                group_size: values?.group_size,
                booking_fee: values?.bookingFee,
                booking_date: values?.booking_date,
                fee_date: values?.fee_date || null,
                payment_type: values?.payment_type,
            };

            // const response: any = await postMethod('add-retreat-booking', row);

            const response: any = await makeApiRequest({
                url: 'add-retreat-booking',
                baseUrl: BASE_URL,
                data: row,
                method: "POST"
            });

            if (response.success === true) {
                CustomToast({
                    type: "success",
                    text1: "Booking Successful",
                    text2: response?.message
                })
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'RetreatTopNav',
                                params: {
                                    retreatid: null,
                                },
                            },
                        ],
                    }),
                );
            }
        } catch (error) {
            console.error('Failed to update lead status:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
            <CustomHeader2 title="Add Booking" />
            <Formik

                onSubmit={(values) => {
                    handleBooking(values);
                }}

                initialValues={{
                    room_type: [],
                    payment_type: '',
                    group_size: '',
                    bookingFee: '',
                    booking_date: '',
                    fee_date: ''
                }}

                validationSchema={bookingSchema}
            >
                {
                    ({ handleChange, handleSubmit, errors, touched, values, setFieldValue }) => {
                        return (
                            <KeyboardAvoidingView style={{ flex: 1 }} >
                                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: moderateScale(10) }} >
                                    <CustomInput text='Group Size' keyboardType='number-pad' value={values?.group_size} handleChangeText={handleChange('group_size')} />
                                    {
                                        errors?.group_size && touched?.group_size && (
                                            <CustomText text={errors?.group_size} color='#ff0000' size={14} />
                                        )
                                    }

                                    <View style={{ marginTop: moderateScale(10) }} >
                                        <CustomText text='Select Pay' weight='500' size={15} />
                                        <Dropdown
                                            data={data}
                                            value={values?.payment_type}
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            placeholder='Select payment type'
                                            labelField="label"
                                            valueField="values"  // keep this
                                            search={false}
                                            onChange={item => {
                                                setFieldValue('payment_type', item?.values);  // <-- fix here
                                            }}
                                        />
                                    </View>
                                    {
                                        errors?.payment_type && touched?.payment_type && (
                                            <CustomText text={errors?.payment_type} color='#ff0000' size={14} />
                                        )
                                    }

                                    <View style={{ marginTop: moderateScale(10) }} >
                                        <CustomText text='Room Type' weight='500' size={15} />
                                        <MultiSelect
                                            style={styles.dropdown}
                                            containerStyle={{ backgroundColor: '#fff' }}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            // activeColor={Colors.orange_bg}
                                            data={roomTypeData}
                                            labelField="label"
                                            valueField="value"
                                            value={values?.room_type}
                                            placeholder="Select Rooms"
                                            onChange={(item: any) => {
                                                setFieldValue(`room_type`, item);
                                            }}
                                            renderRightIcon={() => (
                                                <CustomIcon
                                                    type="AntDesign"
                                                    name="downcircleo"
                                                    color={Colors.gray_font}
                                                />
                                            )}
                                        />
                                    </View>
                                    {
                                        errors?.room_type && touched?.room_type && (
                                            <CustomText text={errors?.room_type} color='#ff0000' size={14} />
                                        )
                                    }

                                    <CustomInput text='Booking Fee' keyboardType='number-pad' handleChangeText={handleChange('bookingFee')} />
                                    {
                                        errors?.bookingFee && touched?.bookingFee && (
                                            <CustomText text={errors?.bookingFee} color='#ff0000' size={14} />
                                        )
                                    }

                                    <View style={{ marginTop: moderateScale(10) }} >
                                        <CustomText text='Booking Date' weight='500' />
                                        <Pressable
                                            style={[
                                                styles.inputContainer,
                                                {
                                                    borderWidth: touched?.booking_date ? 1 : 0,
                                                    borderColor: touched?.booking_date ? '#000' : '#fff',
                                                },
                                            ]}
                                            onPress={() => {
                                                setIsCalendar({
                                                    book: !isCalendar.book,
                                                    fee: false,
                                                });
                                            }}>
                                            <CustomText
                                                text={values.booking_date ? values.booking_date : 'Select Date'}
                                                color={values.booking_date ? '#000' : '#909090'}
                                                weight="400"
                                                size={15}
                                            />
                                        </Pressable>

                                        {isCalendar?.book && (
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

                                                    setFieldValue('booking_date', formattedDate.replaceAll('/', '-'));
                                                    setIsCalendar({
                                                        fee: false,
                                                        book: false
                                                    })
                                                }}
                                            />
                                        )}

                                    </View>
                                    {
                                        errors?.booking_date && touched?.booking_date && (
                                            <CustomText text={errors?.booking_date} color='#ff0000' size={14} />
                                        )
                                    }

                                    <View style={{ marginTop: moderateScale(10) }} >
                                        <CustomText text='Fee Date' weight='500' />
                                        <Pressable
                                            style={[
                                                styles.inputContainer,
                                                {
                                                    borderWidth: touched?.fee_date ? 1 : 0,
                                                    borderColor: touched?.fee_date ? '#000' : '#fff',
                                                },
                                            ]}
                                            onPress={() => {
                                                setIsCalendar({
                                                    fee: !isCalendar.fee,
                                                    book: false,
                                                });
                                            }}>
                                            <CustomText
                                                text={values?.fee_date ? values?.fee_date : 'Select Date'}
                                                color={values?.fee_date ? '#000' : '#909090'}
                                                weight="400"
                                                size={15}
                                            />
                                        </Pressable>

                                        {isCalendar?.fee && (
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

                                                    setFieldValue('fee_date', formattedDate.replaceAll('/', '-'));

                                                    setIsCalendar({
                                                        fee: false,
                                                        book: false
                                                    })
                                                }}
                                            />
                                        )}
                                    </View>
                                    {
                                        errors?.fee_date && touched?.fee_date && (
                                            <CustomText text={errors?.fee_date} color='#ff0000' size={14} />
                                        )
                                    }

                                    <CustomButton title='Submit' loading={loading} disabled={loading} onPress={handleSubmit} customStyle={{ marginTop: moderateScale(20) }} />

                                    <View style={{ marginBottom: moderateScale(20) }} />
                                </ScrollView>
                            </KeyboardAvoidingView>
                        )
                    }
                }
            </Formik>

        </Container>
    )
}

export default AddBookingScreen

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
    dropdown: {
        width: '98%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Colors.gray_font,
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(8),
        marginTop: moderateScale(5),
        paddingVertical: moderateScale(8),
        backgroundColor: '#fff',
    },
    placeholderStyle: {
        color: Colors.gray_font,
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
    error: {
        marginTop: moderateScale(5),
    },
    upload: {
        width: "100%",
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: "#000",
        height: screenHeight * .2,
        marginBottom: moderateScale(10),
        marginTop: moderateScale(5),
        backgroundColor: Colors.orange_blur
    }
})