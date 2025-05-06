import { FlatList, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import { fetchLocationUtility, uploadDocument } from '../../../../../utils/UtilityFuncations'
import DocumentPickerComponent from '../../../../../components/DocumentPicker'
import { BASE_URL, GOOGLE_LOCATION_KEY } from '../../../../../utils/api'
import makeApiRequest from '../../../../../utils/ApiService'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { CustomToast } from '../../../../../components/Customs/CustomToast'
import { useNavigation } from '@react-navigation/native'

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

const CreateRetreat = (props: any) => {

    const exist: any = props?.route?.params?.retreat || {};
    const { user } = useSelector((state: any) => state?.user);
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation();
    const [placeText, setPlaceText] = useState('');
    const [place, setPlace] = useState<any>([]);
    const [locationPlaceText, setLocationPlaceText] = useState<any>([]);
    const [locationPlace, setLocationPlace] = useState<any>([]);
    const [isCalendar, setIsCalendar] = useState({
        start: false,
        end: false
    });
    // console.log("==== exist ===", exist);

    const [documents, setDocuments] = useState<any>([]);
    // console.log("=== document ===",documents);


    const handleDocumentsPicked = (docs: any) => {
        console.log('Picked documents:', docs[0]);
        setDocuments(docs[0]);
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

    const fetchAndSetPlace = async (text: string, setter: any) => {
        try {
            const response = await fetchLocationUtility(text);
            setter(response);
        } catch (error) {
            console.error('Error fetching place:', error);
        }
    };

    useEffect(() => {
        if (placeText) {
            fetchAndSetPlace(placeText, setPlace);
        }
    }, [placeText]);

    useEffect(() => {
        if (locationPlaceText) {  // Assuming you have a different input like `locationText`
            fetchAndSetPlace(locationPlaceText, setLocationPlace);
        }
    }, [locationPlaceText]);  // <-- NOT `locationPlace`


    return (
        <Container>
            <CustomHeader2 title={!exist?.title ? "Create Retreat" : "Update Retreat"} />

            <KeyboardAvoidingView style={{ flex: 1 }} >
                <Formik
                    initialValues={{
                        title: exist?.title || '',
                        hotel: exist["Accommodation Hotel"] ? exist["Accommodation Hotel"] : '',
                        location: exist?.location || '',
                        overview: exist?.overview || '',
                        details: exist["Program Detail"] || '',
                        groupSize: exist?.group_size || '',
                        numOfDays: exist?.no_of_days || '',
                        numOfNights: exist?.no_of_nights || '',
                        price: exist?.price || '',
                        img: null,
                        startDate: exist["start Date"] || '',
                        endDate: exist["end Date"] || '',
                        rooms: ''
                    }}
                    validationSchema={retreatSchema}
                    onSubmit={async (values) => {
                        setLoading(true)
                        const formdata = new FormData;
                        formdata.append('user_id', user?.id.toString());
                        formdata.append('group_size', values?.groupSize);
                        formdata.append('status', '1');
                        formdata.append('No_of_nights', values?.numOfNights);
                        formdata.append('No_of_days', values?.numOfDays);
                        formdata.append('retreat_title', values?.title);
                        formdata.append('retreat_overview', values?.overview);
                        formdata.append('retreat_location', values?.location);
                        formdata.append('start_date', values?.startDate);
                        formdata.append('end_date', values?.endDate);
                        formdata.append('program_details', values?.details);
                        formdata.append('accommodation_hotel', values?.hotel);
                        formdata.append('room', values?.rooms);
                        formdata.append('price', values?.price);
                        if (documents) {
                            formdata.append('upload_image', {
                                uri: documents?.uri,
                                type: documents?.type,
                                name: documents?.name,
                            });
                        }

                        try {

                            const endpoint = exist?.id ? `https://fitwithgrip.com/api/user-update-retreat?id=${exist?.id}` : 'https://fitwithgrip.com/trainer/user-add-retreat'
                            const response: any = await axios.post(endpoint, formdata, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            })

                            if (response?.data?.status === 'success') {
                                CustomToast({
                                    type: "success",
                                    text1: "Retreat Created Successfully",
                                    text2: "You have check your stats on the dashboard"
                                })
                                navigation.goBack();
                            }
                            else {
                                CustomToast({
                                    type: "error",
                                    text1: response?.data?.errors[0],
                                    text2: "Failed to Create Retreat"
                                })
                            }
                            console.log("===== response in the create retreat =====", response);
                        }
                        catch (err: any) {
                            console.error("Error in the create retreat:", err);
                        }
                        finally {
                            setLoading(false)
                        }

                    }}

                >
                    {({ handleSubmit, handleChange, setFieldValue, errors, values, touched }: any) => {
                        useEffect(() => {
                            if (values && !user?.is_registred) {
                                CustomToast({
                                    type: "info",
                                    text1: "Your KYC is pending!",
                                    text2: "You can create after verification"
                                })
                            }
                        }, [!user?.is_registred, values])


                        return (
                            <View style={{ flex: 1 }} >
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
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



                                    <View>
                                        <CustomInput value={values?.accommodation_hotel || placeText} text="Accommodation Hotel" handleChangeText={(text: string) => {
                                            setPlaceText(text);
                                            setFieldValue('accommodation_hotel', '');
                                        }} />
                                        {errors?.hotel && touched?.hotel && (
                                            <CustomText
                                                customStyle={styles.error}
                                                size={12}
                                                text={errors?.hotel}
                                                color="red"
                                            />
                                        )}

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
                                                                    `accommodation_hotel`,
                                                                    item?.description,
                                                                );
                                                                setPlaceText('');
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

                                    <View>
                                        <CustomInput text='Location' values={values?.location || locationPlaceText} handleChangeText={
                                            (text: string) => {
                                                setLocationPlaceText(text);
                                                setFieldValue('location', '');
                                            }} />

                                        {
                                            locationPlace?.length > 0 && locationPlaceText.length > 0 && (
                                                <FlatList
                                                    data={locationPlace}
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
                                                                setLocationPlaceText('');
                                                                setLocationPlace([]);
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
                                        {errors?.location && touched?.location && (
                                            <CustomText
                                                customStyle={styles.error}
                                                size={12}
                                                text={errors?.location}
                                                color="red"
                                            />
                                        )}
                                    </View>

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
                                        {
                                            documents.length > 0 && <View>
                                                <CustomText text={`${documents?.name} uploaded`} weight='500' />
                                            </View>
                                        }
                                    </View>
                                </ScrollView>
                                <View style={{ marginBottom: moderateScale(10), paddingTop: moderateScale(5) }} >
                                    <CustomButton title='Save' disabled={loading}
                                        onPress={() => {
                                            if (!user?.is_registred) {
                                                CustomToast({
                                                    type: "info",
                                                    text1: "Your KYC is pending!",
                                                    text2: "You can create after verification"
                                                })
                                            }
                                            else {
                                                handleSubmit()
                                            }
                                        }}
                                    />
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