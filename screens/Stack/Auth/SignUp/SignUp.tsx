import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Pressable,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';

// Import your custom components
import Container from '../../../../components/Container';
import CustomInput from '../../../../components/Customs/CustomInput';
import CustomButton from '../../../../components/Customs/CustomButton';
import CustomText from '../../../../components/Customs/CustomText';
import CustomIcon from '../../../../components/Customs/CustomIcon';

// Import your utility functions and styles
import { moderateScale } from '../../../../components/Matrix/Matrix';
import Colors from '../../../../utils/Colors';
import { globalStyle } from '../../../../utils/GlobalStyle';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL, TRAINER_REGISTRATION } from '../../../../utils/api';
import { useDispatch } from 'react-redux';
import { signUp, userDetail } from '../../../../redux/Slice/UserSlice/UserSlice';
import CustomToast from '../../../../components/Customs/CustomToast';
import { getHash } from 'react-native-otp-verify';

// Define validation schema using Yup
const trainerSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name is required')
        .max(20, 'Name must be 20 characters or less'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup
        .string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
});

const steps = ['Name', 'E-mail', 'Phone Number'];

const SignUp = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const [hash, setHash] = useState<string>('');
    const navigation:any = useNavigation();
    const [loading, setLoading] = useState(false);
    const dispatch: any = useDispatch();

    useEffect(() => {
        const progress = ((currentStep + 1) / steps.length) * 100;
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 700,
            useNativeDriver: false,
        }).start();
    }, [currentStep]);

    const handleNext = (errors: any, touched: any, setFieldTouched: any) => {
        const field = steps[currentStep];
        const fieldName = getFieldName(field);
        setFieldTouched(fieldName, true, true);
        if (!errors[fieldName]) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const fetchGetHash = async () => {
        getHash().then((hash: any) => {
            setHash(hash[0]);
        }).catch(console.log);
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const getFieldName = (label: string) => {
        switch (label) {
            case 'Name':
                return 'name';
            case 'E-mail':
                return 'email';
            case 'Phone Number':
                return 'phone';
            default:
                return '';
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const response: any = await makeApiRequest({
                baseUrl: BASE_URL,
                url: TRAINER_REGISTRATION,
                data: {
                    name: values?.name,
                    email: values?.email,
                    phone_no: values?.phone,
                    hash: hash,
                    // aadhar_no: values.aadharCardNumber,
                },
                method: 'POST',
            })

            if (response?.success == true) {
                CustomToast({
                    type: 'success',
                    text1: 'Sign Up Successful',
                    text2: "Welcome! Let's get started.",
                });
                navigation.navigate('OtpVerification', {
                    mobile: values?.phone,
                });
            }

            console.log("---- response in the sign up ----", response);

            // await dispatch(signUp({...values,hash:hash}))
            //     .unwrap()
            //     .then(() => {
            //         navigation.navigate('OtpVerification',{
            //             mobile: values.phone,
            //         });
            //         CustomToast({
            //             type: 'success',
            //             text1: 'Sign Up Successful',
            //             text2: "Welcome! Let's get started.",
            //         });
            //     })
            //     .catch((err: any) => {

            //         console.log("--- error int singup page ----",err);

            //         CustomToast({
            //             type: 'error',
            //             text1: 'Sign Up Failed',
            //             text2: err,
            //         });
            //     });
        } catch (err: any) {
            console.log('==== err ====', err.message);
        } finally {
            setLoading(false);
        }
    };


    useFocusEffect(useCallback(() => {
        fetchGetHash();
    }, []))


    // console.log("---- hash in the sign up ----", hash);



    return (
        <View style={{ flex: 1, backgroundColor: '#000', padding: moderateScale(10) }}>
            <Formik
                onSubmit={values => {
                    handleSubmit(values);
                }}
                initialValues={{
                    name: '',
                    email: '',
                    phone: '',
                }}
                validationSchema={trainerSchema}>
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldTouched,
                }) => {
                    const field = steps[currentStep];
                    const fieldName = getFieldName(field);

                    return (
                        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#000' }}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ padding: moderateScale(5), flexGrow: 1 }}
                                keyboardShouldPersistTaps="handled">
                                <View style={styles.progressBarContainer}>
                                    <Animated.View
                                        style={[
                                            styles.progressBar,
                                            {
                                                width: progressAnim.interpolate({
                                                    inputRange: [0, 100],
                                                    outputRange: ['0%', '100%'],
                                                }),
                                            },
                                        ]}
                                    />
                                </View>

                                <CustomText
                                    text={field}
                                    weight="800"
                                    customStyle={{ marginTop: moderateScale(10) }}
                                    color="#6f6f6f"
                                    size={30}
                                />

                                <View style={{ marginTop: moderateScale(20) }}>
                                    {field === 'Name' && (
                                        <>
                                            <CustomInput
                                                placeholder="eg: Jon Doe"
                                                autoCaptital="words"
                                                maxLength={20}
                                                autoFocus={true}
                                                color="#fff"
                                                value={values.name}
                                                handleChangeText={handleChange('name')}
                                            />
                                            {errors.name && touched.name ? (
                                                <Text style={styles.errorText}>{errors.name}</Text>
                                            ) : null}
                                        </>
                                    )}
                                    {field === 'E-mail' && (
                                        <>
                                            <CustomInput
                                                value={values.email}
                                                color="#fff"
                                                autoCaptital="none"
                                                autoFocus={true}
                                                keyboardType="email-address"
                                                placeholder="eg: xyz@grip.com"
                                                handleChangeText={handleChange('email')}
                                            />
                                            {errors.email && touched.email ? (
                                                <Text style={styles.errorText}>{errors.email}</Text>
                                            ) : null}
                                        </>
                                    )}
                                    {field === 'Phone Number' && (
                                        <>
                                            <CustomInput
                                                placeholder="eg: 9876543210"
                                                color="#fff"
                                                keyboardType="numeric"
                                                maxLength={10}
                                                autoCaptital="none"
                                                autoFocus={true}
                                                value={values.phone}
                                                handleChangeText={handleChange('phone')}
                                            />
                                            {errors.phone && touched.phone ? (
                                                <Text style={styles.errorText}>{errors.phone}</Text>
                                            ) : null}
                                        </>
                                    )}
                                </View>

                                <View
                                    style={{
                                        marginTop: moderateScale(20),
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                    {currentStep > 0 && (
                                        <Pressable
                                            onPress={handlePrevious}
                                            style={[
                                                globalStyle.center,
                                                {
                                                    width: moderateScale(40),
                                                    height: moderateScale(40),
                                                    borderRadius: moderateScale(100),
                                                    backgroundColor: '#fff',
                                                },
                                            ]}>
                                            <CustomIcon
                                                type="AntDesign"
                                                size={25}
                                                name="arrowleft"
                                                color="#000"
                                            />
                                        </Pressable>
                                    )}
                                    {currentStep === steps.length - 1 ? (
                                        <CustomButton
                                            bg="#666"
                                            title="Submit"
                                            onPress={handleSubmit}
                                            customStyle={{
                                                flex: 1,
                                                marginLeft: currentStep > 0 ? moderateScale(5) : 0,
                                            }}
                                        />
                                    ) : (
                                        <CustomButton
                                            bg="#666"
                                            title="Next"
                                            onPress={() =>
                                                handleNext(errors, touched, setFieldTouched)
                                            }
                                            customStyle={{
                                                flex: 1,
                                                marginLeft: currentStep > 0 ? moderateScale(5) : 0,
                                            }}
                                        />
                                    )}
                                </View>
                                <Pressable
                                    onPress={() => {
                                        navigation.navigate('Login');
                                    }}
                                    style={[
                                        globalStyle.row,
                                        { alignSelf: 'center', marginTop: moderateScale(10) },
                                    ]}>
                                    <CustomText
                                        text="Already have acount?"
                                        size={16}
                                        color="#666"
                                    />
                                    <CustomText
                                        customStyle={{ marginLeft: moderateScale(5) }}
                                        text="Login"
                                        color="#fff"
                                        size={16}
                                    />
                                </Pressable>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    );
                }}
            </Formik>
        </View>
    );
};


export default SignUp;

const styles = StyleSheet.create({
    progressBarContainer: {
        height: moderateScale(5),
        backgroundColor: '#e0e0e0',
        borderRadius: moderateScale(10),
        overflow: 'hidden',
    },
    progressBar: {
        height: moderateScale(5),
        backgroundColor: Colors.orange,
    },
    errorText: {
        color: 'red',
        marginTop: moderateScale(5),
    },
});
