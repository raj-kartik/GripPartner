import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    View,
  } from 'react-native';
  import React from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { useNavigation } from '@react-navigation/native';
  import * as Yup from 'yup';
  import { Formik } from 'formik';
import Container from '../../components/Container';
import CustomHeader2 from '../../components/Customs/Header/CustomHeader2';
import CustomText from '../../components/Customs/CustomText';
import CustomInput from '../../components/Customs/CustomInput';
import { moderateScale } from '../../components/Matrix/Matrix';
import CustomButton from '../../components/Customs/CustomButton';
import { CustomToast } from '../../components/Customs/CustomToast';
import makeApiRequest from '../../utils/ApiService';
import { BASE_URL } from '../../utils/api';
import { userDetail } from '../../redux/Slice/UserSlice/UserSlice';
  
  const userSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, '*too Short')
      .max(50, 'too Long')
      .required('*required'),
    lastName: Yup.string()
      .min(2, '*too Short')
      .max(50, 'too Long')
      .required('*required'),
    email: Yup.string().required('*required').email('*invalid e-mail'),
    city: Yup.string().required('*required'),
    state: Yup.string().required('*required'),
    add1: Yup.string().required('*required'),
    add2: Yup.string().required('*required'),
    pincode: Yup.string()
      .required('*required')
      .max(6, '*invalid')
      .min(6, '*invalid'),
    mobile: Yup.string()
      .required('*required')
      .max(10, '*invalid')
      .min(10, '*invalid'),
  });
  const RegisterUser = () => {
    const { user } = useSelector((state: any) => state?.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    console.log('==== user register ====', user);
  
    const slideRegister = [
      {
        id: 1,
        label: 'Name',
      },
      {
        id: 2,
        label: 'Location',
      },
      {
        id: 3,
        label: 'Profile',
      },
    ];
    return (
      <Container>
        <CustomHeader2 title="Register Yourself" />
  
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            mobile: user?.phone_number ? user?.phone_number : '',
            state: '',
            city: '',
            add1: '',
            add2: '',
            pincode: '',
          }}
          onSubmit={async (values) => {
            console.log('==== values in the register ====', values);
            try {
              const data = {
                user_id: user?.id,
                email_id: values?.email,
                first_name: values?.firstName,
                last_name: values?.lastName,
                country: 'India',
                state: values?.state,
                city: values?.city,
                pin: values?.pincode,
                address: values?.add1 + values?.add2,
              };
  
              const response: any = await makeApiRequest({
                baseUrl: BASE_URL,
                url: "update-user-detail",
                data: data,
                method: "POST"
              });
  
              if (response?.status) {
                CustomToast({
                  type: "success",
                  text1: "User Update Sucessfully",
                  text2: "You can now access everything"
                })
              }
  
              await dispatch(userDetail());
              // navigation.goBack();
  
  
            } catch (err) {
              console.log('--- error in the form submit ---', err);
              CustomToast({
                type: 'error',
                text1: 'Failed to Register',
                text2: 'Something went wrong! Try after some time',
              });
            }
          }}
          validationSchema={userSchema}>
          {({
            handleSubmit,
            setFieldValue,
            errors,
            touched,
            values,
            handleChange,
          }: any) => {
            return (
              <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    paddingHorizontal: moderateScale(5),
                    flex: 0.9,
                    marginBottom: moderateScale(20),
                  }}>
                  <CustomInput
                    values={values?.firstName}
                    text="First Name"
                    placeholder="Enter First Name"
                    handleChangeText={handleChange('firstName')}
                  />
                  {touched?.firstName && errors?.firstName && (
                    <CustomText
                      text={errors.firstName}
                      customStyle={{ marginTop: moderateScale(5) }}
                      color="#ff0000"
                    />
                  )}
  
                  <CustomInput
                    text="Last Name"
                    values={values?.lastName}
                    placeholder="Enter Last Name"
                    handleChangeText={handleChange('lastName')}
                  />
                  {touched?.lastName && errors?.lastName && (
                    <CustomText
                      text={errors.lastName}
                      customStyle={{ marginTop: moderateScale(5) }}
                      color="#ff0000"
                    />
                  )}
  
                  <CustomInput
                    text="E-mail"
                    values={values?.email}
                    placeholder="abc@gmail.com"
                    handleChangeText={handleChange('email')}
                    keyboardType="email-address"
                  />
                  {touched?.email && errors?.email && (
                    <CustomText
                      text={errors.email}
                      customStyle={{ marginTop: moderateScale(5) }}
                      color="#ff0000"
                    />
                  )}
  
                  <CustomInput
                    text="Mobile Number"
                    values={values?.mobile}
                    placeholder="1234567890"
                    handleChangeText={handleChange('mobile')}
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                  {touched?.mobile && errors?.mobile && (
                    <CustomText
                      text={errors.mobile}
                      customStyle={{ marginTop: moderateScale(5) }}
                      color="#ff0000"
                    />
                  )}
  
                  <CustomInput
                    text="Address 1"
                    values={values?.add1}
                    handleChangeText={handleChange('add1')}
                  />
                  {touched?.add1 && errors?.add1 && (
                    <CustomText
                      text={errors.add1}
                      customStyle={{ marginTop: moderateScale(5) }}
                      color="#ff0000"
                    />
                  )}
  
                  <CustomInput
                    text="Address 2"
                    values={values?.add2}
                    handleChangeText={handleChange('add2')}
                  />
                  {touched?.add2 && errors?.add2 && (
                    <CustomText
                      text={errors.add2}
                      customStyle={{ marginTop: moderateScale(5) }}
                      color="#ff0000"
                    />
                  )}
  
                  <CustomInput
                    text="City"
                    values={values?.city}
                    handleChangeText={handleChange('city')}
                  />
                  {touched?.city && errors?.city && (
                    <CustomText
                      text={errors.city}
                      customStyle={{ marginTop: moderateScale(5) }}
                      color="#ff0000"
                    />
                  )}
  
                  <CustomInput
                    text="State"
                    values={values?.state}
                    handleChangeText={handleChange('state')}
                  />
                  {touched?.state && errors?.state && (
                    <CustomText
                      text={errors.state}
                      customStyle={{ marginTop: moderateScale(5) }}
                      color="#ff0000"
                    />
                  )}
  
                  <CustomInput
                    text="Pincode"
                    keyboardType="numeric"
                    values={values?.pincode}
                    customStyle={{ marginBottom: moderateScale(6) }}
                    handleChangeText={handleChange('pincode')}
                    maxLength={6}
                  />
                  {touched?.pincode && errors?.pincode && (
                    <CustomText
                      text={errors.pincode}
                      customStyle={{ marginTop: moderateScale(5) }}
                      color="#ff0000"
                    />
                  )}
                </ScrollView>
                <View style={{ flex: 0.15 }}>
                  <CustomButton title="Submit" onPress={handleSubmit} />
                </View>
              </KeyboardAvoidingView>
            );
          }}
        </Formik>
      </Container>
    );
  };
  
  export default RegisterUser;
  
  const styles = StyleSheet.create({});
  