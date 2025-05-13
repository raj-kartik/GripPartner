import { FlatList, Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { Formik } from 'formik';
import Container from '@components/Container';
import CustomHeader2 from '@components/Customs/Header/CustomHeader2';
import CustomInput from '@components/Customs/CustomInput';
import CustomText from '@components/Customs/CustomText';
import { moderateScale } from '@components/Matrix/Matrix';
import CustomButton from '@components/Customs/CustomButton';
import TimeModal from '@components/Modal/TimeModal';
import Colors from '@utils/Colors';
import { globalStyle } from '@utils/GlobalStyle';
import { fetchLocationUtility } from '@utils/UtilityFuncations';
import StateModal from '@components/Modal/StateModal';
import DocumentPickerComponent from '@components/DocumentPicker';

const studioSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required('*required')
        .min(2, '*too short')
        .max(50, '*too long'),
    studioType: yup
        .string()
        .trim()
        .required('*required')
        .min(2, '*too short')
        .max(50, '*too long'),
    location: yup
        .string()
        .trim()
        .required('*required')
        .min(2, '*too short')
        .max(50, '*too long'),
    state: yup
        .string()
        .trim()
        .required('*required')
        .min(2, '*too short')
        .max(50, '*too long'),
    pincode: yup
        .string()
        .matches(/^[0-9]{6}$/, '*must be a valid 6-digit pincode')
        .required('*required'),
    email: yup.string().email('*enter valid email').required('*required'),
    capacity: yup
        .number()
        .typeError('*must be a number')
        .min(1, '*must be at least 1')
        .required('*required'),
    openingTime: yup.string().required('*required'),
    closingTime: yup.string().required('*required'),
    contactNumber: yup
        .string()
        .matches(/^[6-9][0-9]{9}$/, '*must be a valid 10-digit phone number')
        .required('*required'),
    studioImage: yup.mixed(),
});

const StudioEdit = (props: any) => {

    // console.log("item in the studio edit", props?.route?.params?.item);
    const { item } = props?.route?.params;
    const [endModal, setEndModal] = useState(false);
    const [startmodal, setStartModal] = useState(false);
    const [placeText, setPlaceText] = useState('');
    const [place, setPlace] = useState<any>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const studioTypeArray = [
        {
            id: 1,
            label: 'Gym',
        },

        {
            id: 2,
            label: 'Yoga',
        },

        {
            id: 3,
            label: 'Zumba',
        },

        {
            id: 4,
            label: 'Pilates',
        },

        {
            id: 5,
            label: 'Dance',
        },

        {
            id: 6,
            label: 'Crossfit',
        },
    ];

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const response = await fetchLocationUtility(placeText);
                setPlace(response); // Assuming the API returns a placeName field
            } catch (error) {
                console.error('Error fetching place:', error);
            }
        }
        fetchPlace();
    }, [placeText]);

    return (
        <Container>
            <CustomHeader2 title="Studio Edit" />
            <Formik
                initialValues={{
                    name: item?.studio_name || '',
                    studioType: item?.studio_type || '',
                    location: item?.location || '',
                    state: item?.state || '',
                    pincode: item?.pincode || '',
                    email: item?.email || '',
                    capacity: item?.capacity.toString() || '',
                    openingTime: item?.opening_time.slice(0, 5) || '',
                    closingTime: item?.closing_time.slice(0, 5) || '',
                    contactNumber: item?.contact_number || '',
                    studioPic: null,
                }}

                validationSchema={studioSchema}
                onSubmit={(values) => {
                    console.log("Form values", values);
                }}
            >
                {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }: any) => (
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                        <ScrollView style={{ paddingHorizontal: moderateScale(3), paddingBottom: moderateScale(20) }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>

                            <View style={{ marginTop: moderateScale(10) }}>
                                <CustomText
                                    size={16}
                                    text="Select Studio Type"
                                    weight="500"
                                />
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}>
                                    {studioTypeArray.map((item: any) => (
                                        <Pressable
                                            onPress={() => {
                                                setFieldValue(`studioType`, item?.label);
                                            }}
                                            style={[globalStyle.row, { marginTop: moderateScale(7), width: moderateScale(90), marginRight: moderateScale(5), height: moderateScale(40) }]}>
                                            <View
                                                style={[globalStyle.center, {
                                                    width: moderateScale(18),
                                                    height: moderateScale(18),
                                                    borderRadius: moderateScale(100),
                                                    marginRight: moderateScale(3),
                                                    borderWidth: 2,
                                                    borderColor: values?.studioType === item?.label ? Colors.success : Colors.gray,
                                                }]}
                                            >
                                                <View
                                                    style={{
                                                        width: moderateScale(10),
                                                        height: moderateScale(10),
                                                        borderRadius: moderateScale(100),
                                                        // marginRight: moderateScale(3),
                                                        backgroundColor: values?.studioType === item?.label ? Colors.success : "#fff",
                                                    }}
                                                />
                                            </View>
                                            <CustomText text={item?.label} />
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </View>

                            <View>
                                <CustomInput
                                    text='Studio Name'
                                    value={values.name}
                                    handleChangeText={handleChange('name')}
                                />
                                {
                                    errors.name && touched.name ? (
                                        <CustomText text={errors?.name} />
                                    ) : null
                                }
                            </View>

                            <View>
                                <CustomInput text='Location' value={placeText} handleChangeText={(text: string) => {
                                    setPlaceText(text);
                                }} />
                                {
                                    place?.length > 0 && placeText.length > 0 && (
                                        <FlatList
                                            data={place}
                                            keyboardShouldPersistTaps="handled"
                                            contentContainerStyle={{
                                                height: moderateScale(300),
                                                zIndex: 2,
                                                borderRadius: moderateScale(10),
                                                borderWidth: 1,
                                                marginTop: moderateScale(10)
                                            }}
                                            keyExtractor={(item: any, index) => index.toString()}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setFieldValue(
                                                            `location`,
                                                            item?.description,
                                                        );
                                                        setPlaceText(item?.description);
                                                        setPlace([]);
                                                    }}
                                                    style={{
                                                        padding: moderateScale(10),
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: Colors.gray,
                                                    }}>
                                                    <CustomText text={item?.description} />
                                                </TouchableOpacity>
                                            )}
                                        />
                                    )
                                }

                            </View>

                            <View style={{ marginVertical: moderateScale(10) }}>
                                <CustomText
                                    text="State"
                                    size={16}
                                    weight="500"
                                    customStyle={{ marginBottom: moderateScale(3) }}
                                />
                                <TouchableOpacity
                                    onPress={() => setIsModalVisible(true)} // pass index to identify which studio item
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        padding: moderateScale(15),
                                        borderRadius: moderateScale(8),
                                    }}>
                                    <CustomText
                                        color={
                                            values?.state
                                                ? '#000'
                                                : Colors.gray_font
                                        }
                                        weight="500"
                                        text={
                                            values?.state || 'Select State'
                                        }
                                    />
                                </TouchableOpacity>

                                <StateModal
                                    showmodal={isModalVisible}
                                    setShowModal={setIsModalVisible}
                                    handleState={(stateValue: string) => {
                                        setFieldValue(`state`, stateValue);
                                        setIsModalVisible(false);
                                    }}
                                />
                                {errors.state &&
                                    touched.state && (
                                        <CustomText
                                            color="red"
                                            customStyle={{ marginTop: moderateScale(5) }}
                                            text={errors?.state}
                                        />
                                    )}
                            </View>

                            <View>
                                <CustomInput
                                    text='Pincode'
                                    value={values.pincode}
                                    keyboardType='number-pad'
                                    maxLength={6}
                                    handleChangeText={handleChange('pincode')}
                                />
                                {
                                    errors.pincode && touched.pincode ? (
                                        <CustomText text={errors?.pincode} />
                                    ) : null
                                }
                            </View>

                            <View>
                                <CustomInput
                                    text='Contact Number'
                                    value={values.contactNumber}
                                    maxLength={10}
                                    keyboardType='number-pad'
                                    handleChangeText={handleChange('contactNumber')}
                                />
                                {
                                    errors.contactNumber && touched.contactNumber ? (
                                        <CustomText text={errors?.contactNumber} />
                                    ) : null
                                }
                            </View>

                            <View>
                                <CustomInput
                                    text='E-mail'
                                    value={values.email}
                                    keyboardType='email-address'
                                    handleChangeText={handleChange('email')}
                                />
                                {
                                    errors.email && touched.email ? (
                                        <CustomText text={errors?.email} />
                                    ) : null
                                }
                            </View>
                            <View>
                                <CustomInput
                                    text='Studio Strength'
                                    value={values.capacity}
                                    keyboardType='number-pad'
                                    handleChangeText={handleChange('capacity')}
                                />
                                {
                                    errors.capacity && touched.capacity ? (
                                        <CustomText text={errors?.capacity} />
                                    ) : null
                                }
                            </View>

                            <View style={{ marginVertical: moderateScale(10) }}>

                                <View style={{ backgroundColor: Colors.orange_blur, padding: moderateScale(10), borderRadius: moderateScale(10) }} >
                                    <CustomText text='Studio Hours' size={18} weight='600' />
                                    <View style={[globalStyle.betweenCenter]} >
                                        <View style={{ marginTop: moderateScale(5), flex: 1, marginRight: moderateScale(5) }} >
                                            <CustomText
                                                text="Opens at"
                                                size={16}
                                                weight="500"
                                                customStyle={{ marginBottom: moderateScale(3) }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setStartModal(true)}
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: '#ccc',
                                                    padding: moderateScale(15),
                                                    borderRadius: moderateScale(8),
                                                }}>
                                                <CustomText
                                                    weight="500"
                                                    color={
                                                        values.openingTime
                                                            ? '#000000'
                                                            : Colors.gray_font
                                                    }
                                                    text={values.openingTime || 'From'}
                                                />
                                            </TouchableOpacity>
                                            {errors?.openingTime &&
                                                touched?.openingTime && (
                                                    <CustomText
                                                        color="red"
                                                        customStyle={{ marginTop: moderateScale(5) }}
                                                        text={errors.openingTime}
                                                    />
                                                )}
                                        </View>
                                        <View style={{ marginTop: moderateScale(5), flex: 1, marginLeft: moderateScale(5) }} >
                                            <CustomText
                                                text="Closes at"
                                                size={16}
                                                weight="500"
                                                customStyle={{ marginBottom: moderateScale(3) }}
                                            />

                                            <TouchableOpacity
                                                onPress={() => setEndModal(true)}
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: '#ccc',
                                                    padding: moderateScale(15),
                                                    borderRadius: moderateScale(8),
                                                }}>
                                                <CustomText
                                                    weight="500"
                                                    color={
                                                        values.closingTime
                                                            ? '#000000'
                                                            : Colors.gray_font
                                                    }
                                                    text={values.closingTime || 'To'}
                                                />
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>

                                <TimeModal
                                    values={values.openingTime}
                                    timeModal={startmodal}
                                    setTimeModal={setStartModal}
                                    handleTime={(time: any) => {
                                        setFieldValue(
                                            `openingTime`,
                                            time.value,
                                        );
                                        setStartModal(false);
                                    }}
                                />

                                {/* Closing Time */}

                                {errors?.closingTime &&
                                    touched?.closingTime && (
                                        <CustomText
                                            color="red"
                                            customStyle={{ marginTop: moderateScale(5) }}
                                            text={errors.closingTime}
                                        />
                                    )}

                                <TimeModal
                                    values={values.closingTime}
                                    timeModal={endModal}
                                    setTimeModal={setEndModal}
                                    handleTime={(time: any) => {
                                        setFieldValue(
                                            `closingTime`,
                                            time.value,
                                        );
                                        setEndModal(false);
                                    }}
                                />
                            </View>

                            <DocumentPickerComponent
                                allowMultiple={true}
                                docType={["image/*"]}
                                customStyle={{ marginTop: moderateScale(5) }}
                                onPickDocument={documents => {
                                    console.log("---- documents in the studio form ----", documents);
                                    setFieldValue(`studioPic`, documents);
                                }}
                            />

                            <ScrollView
                                showsHorizontalScrollIndicator={false}
                                horizontal
                            >
                                {
                                    values?.studioPic && values?.studioPic.length > 0 && values?.studioPic.map((item: any) => {
                                        return (
                                            <View
                                                style={{
                                                    borderWidth: 1.5,
                                                    borderColor: Colors.orange,
                                                    padding: moderateScale(5),
                                                    marginRight: moderateScale(10),
                                                    borderRadius: moderateScale(5)
                                                }}
                                            >
                                                <Image
                                                    source={{ uri: item?.uri }}
                                                    width={moderateScale(100)}
                                                    height={moderateScale(100)}
                                                    borderRadius={moderateScale(3)}
                                                />
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>




                            <View style={{ marginBottom: moderateScale(20), marginTop: moderateScale(20) }}>
                                <CustomButton
                                    title='Submit'
                                    bg={Colors.orange}
                                    // textColor=''
                                    onPress={handleSubmit}
                                />
                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
                )}
            </Formik>
        </Container>
    )
}

export default StudioEdit

const styles = StyleSheet.create({})