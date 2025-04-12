import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../../../../../components/Container'
import CustomHeader2 from '../../../../../components/Customs/Header/CustomHeader2'
import * as yup from 'yup'
import { Form, Formik } from 'formik'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { differenceInCalendarDays } from 'date-fns';
import CustomInput from '../../../../../components/Customs/CustomInput'
import { moderateScale, screenHeight } from '../../../../../components/Matrix/Matrix'
import CalendarPicker from 'react-native-calendar-picker';
import CustomText from '../../../../../components/Customs/CustomText'
import CustomIcon from '../../../../../components/Customs/CustomIcon'
import { MultiSelect } from 'react-native-element-dropdown';
import Colors from '../../../../../utils/Colors'
import CustomButton from '../../../../../components/Customs/CustomButton'
import { globalStyle } from '../../../../../utils/GlobalStyle'
import { uploadDocument } from '../../../../../utils/UtilityFuncations'
import DocumentPickerComponent from '../../../../../components/DocumentPicker'
import { GOOGLE_LOCATION_KEY } from '../../../../../utils/api'

const retreatSchema = yup.object().shape({
    title: yup.string().min(3, '*too short').max(50, '*too long').required('*required'),
    hotel: yup.string().min(3, '*too short').max(50, '*too long').required('*required'),
    rooms: yup.array()
        .of(yup.string().min(1, '*room name required'))
        .min(1, '*At least one room is required')
        .required('*required'),
    location: yup.string().min(3, '*too short').max(50, '*too long'),
    overview: yup.string().min(3, '*too short').max(200, '*too long'),
    details: yup.string().min(3, '*too short').max(500, '*too long').required('*required'),
    groupSize: yup.number().positive().integer().required('*required'),
    numOfDays: yup.number()
        .positive()
        .required('*required')
        .integer()
        .test('days-match', 'Number of days does not match date range', function (value) {
            const { startDate, endDate } = this.parent;
            if (startDate && endDate && value) {
                const diff = differenceInCalendarDays(new Date(endDate), new Date(startDate));
                return value === diff + 1;
            }
            return true;
        }),
    numOfNights: yup.number().positive().integer().required('*required'),
    price: yup.number().positive().required('*required'),
    // img: yup.mixed(),
    startDate: yup.date().required('*Start date is required'),
    endDate: yup.date()
        .required('*End date is required')
        .min(
            yup.ref('startDate'),
            '*End date cannot be before start date'
        ),
});

const CreateRetreat = () => {
    const [isCalendar, setIsCalendar] = useState({
        start: false,
        end: false
    });

    const [documents, setDocuments] = useState([]);

    const handleDocumentsPicked = (docs: any) => {
        console.log('Picked documents:', docs);
        setDocuments(docs);
    };

    const roomArray = [
        { label: 'Single Room', value: 'Single Room' },
        { label: 'Double Rooms', value: 'Double Rooms' },
        { label: 'Three Rooms', value: 'Three Rooms' },
        { label: 'Four Rooms', value: 'Four Rooms' },
        { label: 'Five Rooms', value: 'Five Rooms' },
        { label: 'Six Rooms', value: 'Six Rooms' },
        { label: 'Seven Rooms', value: 'Seven Rooms' },
        { label: 'Eigth Rooms', value: 'Eigth Rooms' },
        { label: 'Nine Rooms', value: 'Nine Rooms' },
        { label: 'Ten Rooms', value: 'Ten Rooms' },
    ];

    return (
        <Container>
            <CustomHeader2 title="Create Retreat" />

            <KeyboardAvoidingView style={{ flex: 1 }} >
                <Formik
                    initialValues={{
                        title: '',
                        hotel: '',
                        location: '',
                        overview: '',
                        details: '',
                        groupSize: '',
                        numOfDays: '',
                        numOfNights: '',
                        price: '',
                        img: null,
                        startDate: '',
                        endDate: '',
                        rooms: '0'
                    }}
                    validationSchema={retreatSchema}
                    onSubmit={(values) => {
                        console.log('Submitted:', values);
                    }}

                >
                    {({ handleSubmit, handleChange, setFieldValue, errors, values, touched }) => {
                        useEffect(() => {
                            console.log("=== error ===", errors);
                        }, [errors]);
                        return (
                            <View style={{ flex: 1 }} >
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    style={{ flex: 1, paddingHorizontal: moderateScale(5), paddingBottom: moderateScale(20) }}
                                >
                                    <CustomInput
                                        text='Title'
                                        value={values?.title}
                                        handleChangeText={handleChange('title')}
                                    />
                                    {errors?.title && touched?.title && (
                                        <CustomText
                                            customStyle={styles.error}
                                            size={12}
                                            text={errors?.title}
                                            color="red"
                                        />
                                    )}

                                    <GooglePlacesAutocomplete
                                        placeholder="Accommodation Hotel"
                                        currentLocationLabel={'Accommodation Hotel'}
                                        onPress={(data: any, details = null) => {
                                            // onChange(data.description); // Update the field value
                                        }}
                                        query={{
                                            key: GOOGLE_LOCATION_KEY,
                                            language: 'en',
                                        }}
                                        textInputProps={{
                                            placeholderTextColor: Colors.gray_font,
                                            returnKeyType: 'search',
                                            // autoFocus: true,
                                            blurOnSubmit: false,
                                        }}
                                        styles={{
                                            textInput: {
                                                ...styles.inputContainer,
                                            },

                                            listView: {
                                                width: '98%',
                                                alignSelf: 'center',
                                            },

                                            description: {
                                                color: Colors.black,
                                                fontFamily: 'Roboto-Regular',
                                                fontSize: 14,
                                            },
                                        }}
                                        fetchDetails={true}
                                    />

                                    <View>
                                        <CustomText
                                            text="Select Rooms"
                                            weight="500"
                                            customStyle={{ marginTop: moderateScale(10) }}
                                        />

                                        <MultiSelect
                                            selectedStyle={styles.selectedStyle}
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            // iconStyle={{width:20,height:30}}
                                            data={roomArray}
                                            search
                                            labelField="label"
                                            valueField="value"
                                            value={values?.rooms}
                                            placeholder="Select Yoga Style"
                                            searchPlaceholder="Search..."
                                            onChange={(item: any) => {
                                                setFieldValue('rooms', item);
                                            }}
                                            renderRightIcon={() => (
                                                <CustomIcon
                                                    type="AntDesign"
                                                    name="downcircleo"
                                                    color={Colors.gray_font}
                                                />
                                            )}
                                        />

                                        {errors?.rooms && touched?.rooms && (
                                            <CustomText
                                                customStyle={styles.error}
                                                size={12}
                                                text={errors?.rooms}
                                                color="red"
                                            />
                                        )}
                                    </View>

                                    <CustomInput
                                        text='No. of Days'
                                        keyboardType='number-pad'
                                        value={values?.numOfDays}
                                        handleChangeText={handleChange('numOfDays')}
                                    />
                                    {errors?.numOfDays && touched?.numOfDays && (
                                        <CustomText
                                            customStyle={styles.error}
                                            size={12}
                                            text={errors?.numOfDays}
                                            color="red"
                                        />
                                    )}

                                    <CustomInput
                                        text='No. of Nights'
                                        keyboardType='number-pad'
                                        value={values?.numOfNights}
                                        handleChangeText={handleChange('numOfNights')}
                                    />

                                    {errors?.numOfNights && touched?.numOfNights && (
                                        <CustomText
                                            customStyle={styles.error}
                                            size={12}
                                            text={errors?.numOfNights}
                                            color="red"
                                        />
                                    )}


                                    <View style={{ marginTop: moderateScale(10) }}>
                                        <CustomText text="Select Valid Duration" weight="500" />

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
                                                    start: !isCalendar.start,
                                                    end: false,
                                                });
                                            }}>
                                            <CustomText
                                                text={values.startDate ? values.startDate : 'From'}
                                                color={values.startDate ? '#000' : '#909090'}
                                                weight="400"
                                                size={15}
                                            />
                                        </Pressable>
                                        {errors.startDate && touched.startDate && (
                                            <CustomText
                                                customStyle={styles.error}
                                                size={12}
                                                text={errors.startDate}
                                                color="red"
                                            />
                                        )}

                                        <Pressable
                                            style={[
                                                styles.inputContainer,
                                                {
                                                    borderWidth: touched.type ? 1 : 0,
                                                    borderColor: touched.type ? '#000' : '#fff',
                                                    marginTop: moderateScale(10),
                                                },
                                            ]}
                                            onPress={() => {
                                                setIsCalendar({
                                                    start: false,
                                                    end: !isCalendar.end,
                                                });
                                            }}>
                                            <CustomText
                                                text={values.endDate ? values.endDate : 'To'}
                                                color={values.endDate ? '#000' : '#909090'}
                                                weight="400"
                                                size={15}
                                            />
                                        </Pressable>
                                        {errors.endDate && touched.endDate && (
                                            <CustomText
                                                customStyle={styles.error}
                                                size={12}
                                                text={errors.endDate}
                                                color="red"
                                            />
                                        )}

                                        <View style={{ marginTop: moderateScale(0) }}>
                                            {isCalendar.end && (
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

                                                        setFieldValue('endDate', formattedDate.replaceAll('/', '-'));
                                                        setIsCalendar({
                                                            start: false,
                                                            end: false,
                                                        });
                                                    }}
                                                />
                                            )}
                                            {isCalendar.start && (
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

                                                        setFieldValue('startDate', formattedDate.replaceAll('/', '-'));
                                                    }}
                                                />
                                            )}
                                        </View>
                                    </View>

                                    <CustomInput
                                        text='Price'
                                        value={values?.price}
                                        keyboardType='number-pad'
                                        handleChangeText={handleChange('price')}
                                    />
                                    {errors?.price && touched?.price && (
                                        <CustomText
                                            customStyle={styles.error}
                                            size={12}
                                            text={errors?.price}
                                            color="red"
                                        />
                                    )}

                                    <CustomInput
                                        text='Group Size'
                                        value={values?.groupSize}
                                        keyboardType='number-pad'
                                        handleChangeText={handleChange('groupSize')}
                                    />
                                    {errors?.groupSize && touched?.groupSize && (
                                        <CustomText
                                            customStyle={styles.error}
                                            size={12}
                                            text={errors?.groupSize}
                                            color="red"
                                        />
                                    )}

                                    <CustomInput
                                        text='Overview'
                                        value={values?.overview}
                                        multiline={true}
                                        numOfLine={10}
                                        handleChangeText={handleChange('overview')}
                                    />
                                    {errors?.groupSize && touched?.groupSize && (
                                        <CustomText
                                            customStyle={styles.error}
                                            size={12}
                                            text={errors?.groupSize}
                                            color="red"
                                        />
                                    )}

                                    <View style={{ marginBottom: moderateScale(10) }} >
                                        <CustomInput
                                            text='Program Detail'
                                            multiline={true}
                                            numOfLine={20}
                                            value={values?.details}
                                            // customStyle={{}}
                                            handleChangeText={handleChange('details')}
                                        />
                                        {errors?.groupSize && touched?.groupSize && (
                                            <CustomText
                                                customStyle={styles.error}
                                                size={12}
                                                text={errors?.groupSize}
                                                color="red"
                                            />
                                        )}
                                    </View>

                                    <View>
                                        <CustomText text='Upload Pictures' weight='500' />
                                        <DocumentPickerComponent
                                            onPickDocument={handleDocumentsPicked}
                                            allowMultiple={true}
                                            docType={['image/jpeg', 'image/png', 'application/pdf']} // optional file types
                                            customStyle={{ marginVertical: 20 }}
                                            instruction="Accepted formats: JPEG, PNG, PDF. Max size 2MB"
                                        />
                                    </View>
                                </ScrollView>
                                <View style={{ marginBottom: moderateScale(10) }} >
                                    <CustomButton title='Save' onPress={handleSubmit} />
                                </View>
                            </View>
                        )
                    }}
                </Formik>
            </KeyboardAvoidingView>
        </Container>
    )
}

export default CreateRetreat

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