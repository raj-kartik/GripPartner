import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Container from '../../components/Container'
import CustomHeader2 from '../../components/Customs/Header/CustomHeader2'
import * as yup from 'yup'
import { Formik } from 'formik'
import CustomInput from '@components/Customs/CustomInput'
import CustomText from '@components/Customs/CustomText'
import { moderateScale } from '@components/Matrix/Matrix'
import CustomButton from '@components/Customs/CustomButton'
import makeApiRequest from '@utils/ApiService'
import { BASE_URL, POST_KYC_VALIDATE, POST_VERIFY_AADHAAR_OTP } from '@utils/api'
import { globalStyle } from '@utils/GlobalStyle'
import CustomToast from '@components/Customs/CustomToast'
import Colors from '@utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { userDetail } from '@redux/Slice/UserSlice/UserSlice'
import Images from '@utils/Images'
import FastImage from 'react-native-fast-image'

const kycSchema = yup.object().shape({
  name: yup.string().required('*required'),
  aadhaarCardNumber: yup.string().min(12, "*too short").required("*required"),
  otp: yup.string().required("*OTP required").min(6, "*invalid OTP").max(6)
})

const KycVerification = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [requestId, setRequestId] = useState<string>("");
  const { user } = useSelector((state: any) => state?.user);
  const [loading, setloading] = useState(false);
  const [aadhaar, setAadhaar] = useState<any>(null);
  const [isAadharLoading, setIsAadharLoading] = useState(false);
  const kycArray = [
    {
      id: 1,
      label: "Name"
    },
    {
      id: 1,
      label: "Aadhaar Card Number"
    },
    {
      id: 1,
      label: "OTP Verification"
    },
  ]

  // console.log("---- user id -----", user?.id);


  const handleAadhaarValidate = async (values: any) => {
    setloading(true);
    try {
      const response: any = await makeApiRequest({
        method: "POST",
        baseUrl: BASE_URL,
        url: POST_VERIFY_AADHAAR_OTP,
        data: {
          requestId,
          otp: values?.otp,
          user_id: user?.id,
          aadhaarNumber: values?.aadhaarCardNumber || aadhaar
        }
      });

      console.log("------ response in aadhar otp verification ----", response);
      if (response?.success) {
        CustomToast({
          type: "success",
          text1: "Your KYC has been successful",
          text2: "Now you can access our application"
        });
        navigation.navigate('PanVerification')
      }
      else if (response?.code === 403) {
        CustomToast({
          type: "success",
          text1: response?.message,
          text2: "Now you can access our application"
        });

        await dispatch(userDetail());
      }


    }
    catch (err: any) {
      console.error("Error in the KYC verification", err);
    }
    finally {
      setloading(false);
    }
  }


  console.log("---- aadhaar ----", aadhaar);



  const handleAadar = async () => {
    // await dispatch(userDetail())
    // console.log("----- values?.aadhaarCardNumber -----", aadhaarText);
    setIsAadharLoading(true);
    try {
      const response: any = await makeApiRequest({
        method: "POST",
        baseUrl: BASE_URL,
        url: POST_KYC_VALIDATE,
        data: {
          // name: values?.name,
          aadhaarNumber: aadhaar
        }
      });

      console.log("---- response in the aadharr ----", response);

      // console.log("---- response in the aadhaar card otp ----", response?.data?.result?.request_id);

      if (response?.code === 200) {
        setRequestId(response?.data?.result?.request_id)
      }
      else if (response?.code === 500) {
        CustomToast({
          type: "error",
          text1: "Somethin went wrong",
          text2: "Please try after sometime"
        })
      }

    }
    catch (err: any) {
      console.error("Error in the KYC verification", err);
      CustomToast({
        type: "error",
        text1: "Somethin went wrong",
        text2: "Please try after sometime"
      })
    }
    finally {
      setIsAadharLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }} >
      <View style={{ backgroundColor: "#fff" }} >
        <CustomHeader2 title="KYC Verification" />
        <Images.Studio2 width={moderateScale(350)} style={{ alignSelf: "center" }} height={moderateScale(200)} fill={Colors.orange} color={Colors.orange} />
      </View>

      <View style={{ flex: 1, borderTopRightRadius: moderateScale(20), borderTopLeftRadius: moderateScale(20), paddingHorizontal: moderateScale(10) }} >
        <Formik
          initialValues={{
            name: "",
            aadhaarCardNumber: aadhaar?.length === 12 ? aadhaar : "",
            otp: ''
          }}
          enableReinitialize
          validationSchema={kycSchema}
          onSubmit={(values: any) => {
            handleAadhaarValidate(values)
          }}
        >
          {({ handleChange, values, errors, touched, handleSubmit }: any) => {

            // console.log("---- aadhaar card number ----", values?.aadhaarCardNumber);

            return (
              <KeyboardAvoidingView style={{ flex: 1 }} >
                <ScrollView
                  style={{ paddingHorizontal: moderateScale(5) }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >

                  <View style={[globalStyle.flex, { alignItems: 'flex-end' }]} >
                    <CustomInput
                      text='Aadhaar Card Number'
                      placeholder='eg: 123412341234'
                      value={aadhaar}
                      maxLength={12}
                      handleChangeText={(text) => {
                        // console.log("---- text ---",text);
                        setAadhaar(text)

                        // handleChange('aadhaarCardNumber',text)
                      }}
                      keyboardType='numeric'
                      customStyle={{ flex: 1 }}
                    />
                    <CustomButton
                      title='Verify'
                      disabled={isAadharLoading}
                      loading={isAadharLoading}
                      onPress={() => {
                        if (aadhaar && aadhaar.length >= 12) {
                          handleAadar()
                        }
                        else {
                          CustomToast({
                            type: "info",
                            text1: "Invalid OTP! Please fill the OTP first",
                            text2: ""
                          })
                        }
                      }}
                      customStyle={{
                        width: "45%",
                        marginLeft: moderateScale(5),
                        paddingTop: moderateScale(5)
                      }}
                    />
                  </View>
                  {
                    errors?.aadhaarCardNumber && touched?.aadhaarCardNumber && (
                      <CustomText text={errors?.aadhaarCardNumber} size={13} color='#ff0000' customStyle={{ marginTop: moderateScale(5) }} />
                    )
                  }
                  <CustomInput
                    text='Name (As per the Document)'
                    placeholder='eg: Jon Doe'
                    value={values?.name}
                    handleChangeText={handleChange('name')}
                    autoCapitalize='words'
                  />
                  {
                    errors?.name && touched?.name && (
                      <CustomText text={errors?.name} size={13} color='#ff0000' customStyle={{ marginTop: moderateScale(5) }} />
                    )
                  }


                  <CustomInput
                    text='OTP Verification'
                    maxLength={6}
                    handleChangeText={handleChange('otp')}
                    keyboardType='numeric'
                  />
                  {
                    errors?.otp && touched?.otp && (
                      <CustomText text={errors?.otp} size={13} color='#ff0000' customStyle={{ marginTop: moderateScale(5) }} />
                    )
                  }

                  <View style={{ marginTop: moderateScale(20) }} >
                    <CustomButton
                      title='Validate KYC'
                      onPress={handleSubmit}
                      loading={loading}
                      disabled={loading}
                      // onPress={() => {
                      //   navigation.navigate('IsAddStudio')
                      // }}
                      customStyle={{ alignSelf: "flex-end" }}
                      textColor='#000'
                      bg={Colors.orange}
                    />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            )
          }}
        </Formik>
      </View>
    </View>
  )
}

export default KycVerification

const styles = StyleSheet.create({})