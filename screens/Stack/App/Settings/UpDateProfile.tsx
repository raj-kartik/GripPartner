import { Alert, Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../../../../components/Container'
import { useSelector } from 'react-redux'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import * as yup from 'yup'
import { FieldArray, Formik } from 'formik'
import CustomInput from '../../../../components/Customs/CustomInput'
import CustomText from '../../../../components/Customs/CustomText'
import DocumentPickerComponent from '../../../../components/DocumentPicker'
import { moderateScale } from '../../../../components/Matrix/Matrix'
import Colors from '../../../../utils/Colors'
import CalendarPicker from 'react-native-calendar-picker';
import { Dropdown } from 'react-native-element-dropdown'
import CustomButton from '../../../../components/Customs/CustomButton'
import CustomIcon from '../../../../components/Customs/CustomIcon'
import { globalStyle } from '../../../../utils/GlobalStyle'
import Images from '../../../../utils/Images'
// import DocumentPicker from 'react-native-document-picker';
import axios from 'axios'
import { BASE_URL } from '../../../../utils/api'
import { CustomToast } from '../../../../components/Customs/CustomToast'
import { useNavigation } from '@react-navigation/native'

const profileSchema = yup.object().shape({
    firstName: yup.string().required("*required").min(2, '*too short').max(50, "*too long"),
    lastName: yup.string().min(2, '*too short').max(50, "*too long"),
    location: yup.string().min(2, '*too short').required("*required"),
    phoneNumber: yup.string().required("*required").min(9, "*invalid mobile number").max(11, "*invalid mobile number"),
    email: yup.string().required("*required").email("*invalid"),
    dob: yup.string().required("*required"),
    gender: yup.string().required("*required"),
    skills: yup.string().required("*required"),
    about: yup.string().required("*required").max(500, "*too long! within 500 words"),
    fblink: yup.string(),
    instalink: yup.string(),
    youtubelink: yup.string(),
    linkedInlink: yup.string(),

    certificate: yup
        .mixed()
        // .required("*certificate required")
        .test("fileType", "*unsupported file type", (value: any) => {
            if (!value) return false;
            const supportedFormats = ["application/pdf", "image/jpeg", "image/png"];
            return supportedFormats.includes(value.type);
        }),

    profilePhoto: yup
        .mixed()
        .test("fileType", "*unsupported image type", (value: any) => {
            if (!value) return false;
            const supportedFormats = ["image/jpeg", "image/png", "image/jpg"];
            return supportedFormats.includes(value.type);
        }),
});


const UpdateProfile = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [isCalendar, setIsCalendar] = useState(false);
    const genderOptions = [
        { id: 1, label: 'Male', value: 'male' },
        { id: 2, label: 'Female', value: 'female' },
        { id: 3, label: 'Other', value: 'other' },
    ];

    const { user } = useSelector((state: any) => state?.user);

    // console.log("=== user in the profile ====", user);

    const name = user?.first_name ? user?.first_name.trim().split(" ") : "";
    console.log("=== name ===", name);



    return (
        <Container>
            <CustomHeader2 title="Profile" />
            <View style={{ flex: 1 }} >
                <Formik
                    onSubmit={async (values: any) => {
                        setLoading(true);
                        try {
                            const formData = new FormData();
                            formData.append('first_name', values?.firstName);
                            formData.append('last_name', values?.lastName);
                            formData.append('email_id', values?.email);
                            formData.append('gender', values?.gender);
                            formData.append('phone_no', values?.phoneNumber);
                            formData.append('facebook', values?.fblink);
                            formData.append('youtube', values?.youtubelink);
                            formData.append('linkedin', values?.linkedInlink);
                            formData.append('instagram', values?.instalink);
                            formData.append('birtday', values?.dob);
                            formData.append('address', values?.location);
                            formData.append('about_me', values?.about);
                            // formData.append('language', values?.language);
                            formData.append('skills', values?.skills);
                            formData.append('id', user?.id);

                            if (values?.profilePhoto) {
                                formData.append('profile_pic', {
                                    uri: values?.profilePhoto?.uri,
                                    type: values?.profilePhoto?.type,
                                    name: values?.profilePhoto?.name,
                                });
                            }

                            if (values?.certificate) {
                                formData.append('user_certificates', {
                                    uri: values?.certificate.uri,
                                    type: values?.certificate.type,
                                    name: values?.certificate.name,
                                });
                            }


                            const response: any = await axios.post(`${BASE_URL}update-trainer-profile?id=${user?.id}`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            });

                            console.log("==== response in the update profile ====", response);

                            if (response?.data?.status === 'success') {
                                CustomToast({
                                    type: "success",
                                    text1: "Profile Updated Successfully",
                                    text2: "Your profile has been updated"
                                });
                                navigation.goBack();
                            }
                            else {
                                CustomToast({
                                    type: "error",
                                    text1: "Profile not Updated Successfully",
                                    text2: "Your profile has not updated"
                                });

                            }

                        }
                        catch (err) {
                            console.log("Error in the Update profile:", err);
                        }
                        finally {
                            setLoading(false);
                        }
                    }}
                    validationSchema={profileSchema}
                    initialValues={{
                        firstName: name[0] || '',
                        lastName: name[1] || '',
                        email: user?.email || '',
                        phoneNumber: user?.phone_number || "",
                        dob: user?.profile?.birtday || '',
                        gender: user?.profile?.gender || '',
                        skills: user?.profile?.skills || '',
                        about: '',
                        fblink: '',
                        instalink: '',
                        youtubelink: '',
                        linkedInlink: '',
                        location: user?.profile?.address || "",
                        certificate: null,      // for file input
                        profilePhoto: null      // for image input
                    }}
                >

                    {
                        ({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                            setFieldValue
                        }: any) => {

                            useEffect(() => {
                                console.log("=== error in the update profile ====", errors);

                            }, [errors])
                            return (
                                <KeyboardAvoidingView style={{ flex: 1 }} >
                                    <ScrollView style={{ flex: 0.9 }} showsVerticalScrollIndicator={false}>

                                        {
                                            values?.profilePhoto ? (
                                                <TouchableOpacity
                                                    onPress={async () => {
                                                        try {
                                                            const res = await DocumentPicker.pickSingle({
                                                                type: [DocumentPicker.types.images],
                                                            });

                                                            console.log("=== res in the document picker ====", res);

                                                            setFieldValue('profilePhoto', res)
                                                        } catch (err) {
                                                            if (DocumentPicker.isCancel(err)) {
                                                                // Alert.alert('Canceled from single doc picker');
                                                            } else {
                                                                Alert.alert('Unknown Error: ' + JSON.stringify(err));
                                                                throw err;
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Image
                                                        style={[
                                                            globalStyle.center,
                                                            {
                                                                width: moderateScale(100),
                                                                height: moderateScale(100),
                                                                borderRadius: moderateScale(10),
                                                                backgroundColor: '#f7f7f7',
                                                                alignSelf: 'center',
                                                            },
                                                        ]}
                                                        source={{ uri: values?.profilePhoto?.uri || user?.profilePic }}
                                                    />
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={async () => {
                                                        try {
                                                            const res = await DocumentPicker.pickSingle({
                                                                type: [DocumentPicker.types.images],
                                                            });

                                                            console.log("=== res in the document picker ====", res);

                                                            setFieldValue('profilePhoto', res)
                                                        } catch (err) {
                                                            if (DocumentPicker.isCancel(err)) {
                                                                // Alert.alert('Canceled from single doc picker');
                                                            } else {
                                                                Alert.alert('Unknown Error: ' + JSON.stringify(err));
                                                                throw err;
                                                            }
                                                        }
                                                    }}
                                                    style={[
                                                        globalStyle.center,
                                                        {
                                                            width: moderateScale(100),
                                                            height: moderateScale(100),
                                                            borderRadius: moderateScale(20),
                                                            backgroundColor: '#f7f7f7',
                                                            alignSelf: 'center',
                                                        },
                                                    ]}>
                                                    <Images.Logo
                                                        width={moderateScale(80)}
                                                        height={moderateScale(80)}
                                                    />
                                                    <View
                                                        style={[
                                                            globalStyle.row,
                                                            { position: 'absolute', bottom: 0, right: 0 },
                                                        ]}>
                                                        {/* <CustomText text="Edit Photo" /> */}
                                                        <CustomIcon type="Feather" name="edit" size={20} />
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }

                                        <CustomInput
                                            customStyle={{ width: "98%", alignSelf: "center" }}
                                            text='First Name'
                                            values={values.firstName}
                                            handleChangeText={handleChange('firstName')}
                                        // // onBlur={handleBlur('firstName')}
                                        />
                                        {touched.firstName && errors.firstName && (
                                            <CustomText text={errors.firstName} color="#ff0000" />
                                        )}

                                        <CustomInput
                                            customStyle={{ width: "98%", alignSelf: "center" }}
                                            text='Last Name'
                                            values={values.lastName}
                                            handleChangeText={handleChange('lastName')}
                                        // onBlur={handleBlur('lastName')}
                                        />
                                        {touched.lastName && errors.lastName && (
                                            <CustomText text={errors.lastName} color="#ff0000" />
                                        )}

                                        <CustomInput
                                            customStyle={{ width: "98%", alignSelf: "center" }}
                                            keyboardType='email-address'
                                            text='E-mail'
                                            values={values.email}
                                            handleChangeText={handleChange('email')}
                                        // onBlur={handleBlur('email')}
                                        />
                                        {touched.email && errors.email && (
                                            <CustomText text={errors.email} color="#ff0000" />
                                        )}

                                        <CustomInput
                                            customStyle={{ width: "98%", alignSelf: "center" }}
                                            keyboardType='number-pad'
                                            text='Phone Number'
                                            values={values.phoneNumber}
                                            handleChangeText={handleChange('phoneNumber')}
                                        // // onBlur={handleBlur('phoneNumber')}
                                        />
                                        {touched.phoneNumber && errors.phoneNumber && (
                                            <CustomText text={errors.phoneNumber} color="#ff0000" />
                                        )}

                                        <View style={{ marginTop: moderateScale(10) }} >
                                            <CustomText text='Date of Birth' weight='500' />
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
                                                    setIsCalendar(true);
                                                }}>
                                                <CustomText
                                                    text={values.dob ? values.dob : 'Select Date of Birth'}
                                                    color={values.dob ? '#000' : '#909090'}
                                                    weight="400"
                                                    size={15}
                                                />
                                            </Pressable>
                                            {
                                                isCalendar && <CalendarPicker
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

                                                        setFieldValue('dob', formattedDate.replaceAll('/', '-'));
                                                        setIsCalendar(false);
                                                    }}
                                                />
                                            }

                                        </View>

                                        <CustomInput
                                            customStyle={{ width: "98%", alignSelf: "center" }}
                                            text='Location'
                                            values={values.location}
                                            handleChangeText={handleChange('location')}
                                        // onBlur={handleBlur('location')}
                                        />
                                        {touched.location && errors.location && (
                                            <CustomText text={errors.location} color="#ff0000" />
                                        )}

                                        <CustomInput
                                            customStyle={{ width: "98%", alignSelf: "center" }}
                                            text='Skills'
                                            values={values.skills}
                                            handleChangeText={handleChange('skills')}
                                        // onBlur={handleBlur('skills')}
                                        />
                                        {touched.skills && errors.skills && (
                                            <CustomText text={errors.skills} color="#ff0000" />
                                        )}

                                        <CustomInput
                                            customStyle={{ width: "98%", alignSelf: "center" }}
                                            text='About'
                                            multiline={true}
                                            numOfLine={10}
                                            numberOfLines={10}
                                            values={values.about}
                                            handleChangeText={handleChange('about')}
                                        // onBlur={handleBlur('about')}
                                        />
                                        {touched.about && errors.about && (
                                            <CustomText text={errors.about} color="#ff0000" />
                                        )}

                                        <CustomInput
                                            customStyle={{ width: "98%", alignSelf: "center" }}
                                            text='Facbook Link'
                                            values={values.fblink}
                                            handleChangeText={handleChange('fblink')}
                                        />
                                        <CustomInput
                                            customStyle={{ width: "98%", alignSelf: "center" }}
                                            text='Instagram Link'
                                            values={values.instalink}
                                            handleChangeText={handleChange('instalink')}
                                        />
                                        <CustomInput
                                            customStyle={{ width: "98%", alignSelf: "center" }}
                                            text='LinkedIn Link'
                                            values={values.linkedInlink}
                                            handleChangeText={handleChange('linkedInlink')}
                                        />
                                        <CustomInput
                                            customStyle={{ width: "98%", alignSelf: "center" }}
                                            text='YouTube Link'
                                            values={values.youtubelink}
                                            handleChangeText={handleChange('youtubelink')}
                                        />

                                        <View style={{ marginVertical: moderateScale(10) }}>
                                            <CustomText text='Gender' weight='500' />
                                            <Dropdown
                                                data={genderOptions}
                                                value={values.gender}
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                placeholder='Select gender'
                                                labelField="label"
                                                valueField="value"
                                                search={false}
                                                onChange={(item) => setFieldValue('gender', item.value)}
                                            />
                                            {touched.gender && errors.gender && (
                                                <CustomText text={errors.gender} color="#ff0000" />
                                            )}
                                        </View>

                                        <View style={{ marginBottom: 20 }}>
                                            <CustomText text='Certificate' weight='500' />
                                            {/* <DocumentPickerComponent onPickDocument={(file: any) => {
                                                setFieldValue('certificate', file[0])
                                            }} /> */}
                                            {touched.certificate && errors.certificate && (
                                                <CustomText text={errors.certificate} color="#ff0000" />
                                            )}

                                            {
                                                values?.certificate && (
                                                    <View style={[globalStyle.row]} >
                                                        <CustomIcon type='MaterialCommunityIcons' name='sticker-check-outline' color={Colors.success} />
                                                        <CustomText customStyle={{ marginLeft: moderateScale(5) }} text={values?.certificate?.name} weight='500' />
                                                    </View>
                                                )
                                            }
                                        </View>
                                    </ScrollView>
                                    <View style={{ flex: .1, paddingTop: moderateScale(10) }} >
                                        <CustomButton disabled={loading} onPress={handleSubmit} title='Save' bg={Colors.orange} />
                                    </View>
                                </KeyboardAvoidingView>
                            )
                        }
                    }

                </Formik>
            </View>
        </Container >
    )
}

export default UpdateProfile

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