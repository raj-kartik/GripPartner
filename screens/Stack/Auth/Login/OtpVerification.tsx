import { Pressable, StyleSheet, Text, TextInput, View, Image, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { globalStyle } from '../../../../utils/GlobalStyle'
import Images from '../../../../utils/Images'
import { userDetail, verifyOtp } from '../../../../redux/Slice/UserSlice/UserSlice'
import { BASE_URL, POST_LOGIN_OTP_REQUEST } from '../../../../utils/api'
import makeApiRequest from '../../../../utils/ApiService'
import CustomToast  from '../../../../components/Customs/CustomToast'
import CustomInput from '../../../../components/Customs/CustomInput'
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix'
import Container from '../../../../components/Container'
import CustomText from '../../../../components/Customs/CustomText'
import CustomButton from '../../../../components/Customs/CustomButton'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import Colors from '../../../../utils/Colors'
import CustomIcon from '../../../../components/Customs/CustomIcon'
import {
    getHash,
    startOtpListener,
    useOtpVerify,
} from 'react-native-otp-verify';
import CustomOtpInput from '../../../../components/Customs/CustomOtp'


const OtpVerification = (props: any) => {

    // const params = useRoute();
    const { loading, auth, error } = useSelector((state: any) => state.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [otp, setOtp] = useState('');
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(60); // Countdown timer set to 60 seconds
    const [verifyLoading, setVerifyLoading] = useState(false);

    const { stopListener } = useOtpVerify({ numberOfDigits: 6 });
    useEffect(() => {
        startOtpListener((message) => {
            try {
                const otpSent = /(\d{6})/g.exec(message)?.[1]; // updated to match 4 digits
                if (otpSent) {
                    setOtp(otpSent);
                    stopListener(); // stop listener after OTP is read
                }
            } catch (err) {
                console.error('Failed to extract OTP:', err);
            }
        });

        return () => {
            stopListener(); // cleanup on unmount
        };
    }, []);

    const { mobile } = props?.route?.params;
    const handleVerification = async () => {
        if (otp.length < 6) {
            CustomToast({
                type: 'error',
                text1: 'Invalid OTP',
                text2: 'Please enter a valid OTP',
            });
            return;
        }

        try {
            setVerifyLoading(true);
            // Dispatch the verifyOtp thunk with the mobile number and OTP
            await dispatch(
                verifyOtp({
                    mobile: props?.route?.params?.mobile,
                    otp,
                })
            )
                .unwrap() // Unwrap the promise to handle success/failure locally
                .then(() => {
                    CustomToast({
                        type: 'success',
                        text1: 'OTP Verified',
                        text2: 'You are successfully logged in.',
                    });

                    const fetchUser = async () => {
                        await dispatch(userDetail());
                    };

                    fetchUser();
                    // navigation.navigate('Home'); // Navigate to Home on success
                })
                .catch((err: any) => {
                    CustomToast({
                        type: 'error',
                        text1: 'OTP Verification Failed',
                        text2: err,
                    });
                });
        } catch (err) {
            console.error('Error in the Mobile OTP verification:', err);
        }
        finally {
            setVerifyLoading(false);
        }
    };

    const handleEdit = () => {
        // setIsSent(false);
    }
    const handleResendOTP = async () => {
        setIsResendDisabled(true); // Disable the resend button initially
        setCountdown(60); // Start 60-second cooldown

        try {
            const response = await axios.post(`${BASE_URL}${POST_LOGIN_OTP_REQUEST}`, {
                phone_no: props?.route?.params?.mobile,
            });

            // console.log("===== response in resent otp ====", response);


            if (response?.status === 200) {
                CustomToast({
                    type: 'success',
                    text1: 'OTP Resent',
                    text2: 'A new OTP has been sent to your mobile.',
                });

                // Start the timer for re-enabling the resend button after 60 seconds
                setTimeout(() => {
                    setIsResendDisabled(false); // Enable the resend button
                }, 60000); // 60 seconds
            } else {
                CustomToast({
                    type: 'error',
                    text1: 'Failed to Resend OTP',
                    text2: 'Please try again later.',
                });
            }
        } catch (err) {
            console.error('Error in Resend OTP:', err);
            CustomToast({
                type: 'error',
                text1: 'Error in Resend OTP',
                text2: 'Something went wrong.',
            });
        }
    };


    // Update countdown every second while it’s greater than 0
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            // setIsResendDisabled(false);
            return () => clearTimeout(timer); // Clear timeout on unmount
        }

        if (countdown === 0) {
            setIsResendDisabled(false); // Re-enable the resend button when countdown reaches 0
        }
    }, [countdown]);

    useEffect(() => {
        if (otp.length === 6) {
            const timer = setTimeout(() => {
                handleVerification();
            }, 1000);
            return () => clearTimeout(timer); // Clean up if otp changes before timeout completes
        }
    }, [otp]);


    return (
        <View style={{ position: "relative", zIndex: 10, flex: 1 }} >
            <StatusBar backgroundColor="#000" />
            <Image source={Images.OTP} style={styles.background} />
            <View style={{ backgroundColor: "rgba(0,0,0,0.6)", flex: 1, paddingVertical: moderateScale(15), paddingHorizontal: moderateScale(15) }} >
                <View style={{ flex: 0.9 }} >
                    <View style={[globalStyle.row, { marginBottom: moderateScale(30) }]} >
                        <Pressable onPress={() => { navigation.goBack() }} style={[globalStyle.center]} >
                            <CustomIcon
                                type='AntDesign'
                                name='arrowleft'
                                color='#fff'
                            />
                        </Pressable>
                        <CustomText customStyle={{ marginLeft: moderateScale(10) }} text='OTP Verification' weight='600' size={22} color='#fff' />
                    </View>
                    <CustomText color='#ddd' customStyle={{ marginBottom: moderateScale(10) }} weight='500' size={17} text={`We have sent a verification code to  +91-${mobile}`} />

                    {/* custom OTP */}
                    <CustomOtpInput code={otp} setCode={setOtp} />

                    {/* <CustomInput keyboardType='numeric' text={""} maxLength={6} value={otp} handleChangeText={(text: string) => { setOtp(text) }} /> */}
                    <View style={{ alignItems: "flex-end", marginTop: moderateScale(15) }} >
                        <Pressable onPress={handleResendOTP} disabled={isResendDisabled} >
                            <CustomText color='#ccc' text={isResendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'} weight='500' />
                        </Pressable>
                    </View>
                </View>
                <View style={{ flex: .15, alignItems: "center" }} >
                    <CustomButton loading={verifyLoading} disabled={otp.length !== 6} bg={Colors.gray_font} title='Continue' onPress={handleVerification} customStyle={{ marginTop: moderateScale(10) }} />
                    <Pressable style={{ marginTop: moderateScale(10) }} onPress={() => { navigation.goBack() }} >
                        <CustomText text='Back to login' color='#ccc' weight='400' />
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default OtpVerification

const styles = StyleSheet.create({
    otpContainer: {
        borderWidth: 1,
        width: screenWidth,
        alignSelf: 'center',
        padding: moderateScale(10),
        borderTopLeftRadius: moderateScale(15),
        borderTopRightRadius: moderateScale(15),
        backgroundColor: "#ccc",
        elevation: 5
    },
    background: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: screenWidth,
        height: screenHeight,
        zIndex: -1
    }
})