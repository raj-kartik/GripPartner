import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useState } from 'react'
import Container from '../../../../components/Container'
import { useSelector } from 'react-redux'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import * as yup from 'yup'
import { Formik } from 'formik';
import CustomButton from '../../../../components/Customs/CustomButton'
import CustomInput from '../../../../components/Customs/CustomInput'
import CustomText from '../../../../components/Customs/CustomText'
import { moderateScale } from '../../../../components/Matrix/Matrix'
import Colors from '../../../../utils/Colors'
import StateModal from '../../../../components/Modal/StateModal'
import TimeModal from '../../../../components/Modal/TimeModal'

interface StudioFormValues {
  name: string;
  location: string;
  state: string;
  pincode: string;
  contactNumber: string;
  email: string;
  capacity: string;
  // aadharCard: DocumentPickerResponse | null;
  aadharCard: any;
  aadharCardNumber: string;
  // panCard: DocumentPickerResponse | null;
  panCard: any;
  panCardNumber: string;
  openingTime: string;
  closingTime: string;
}

interface StudioFormValues {
  name: string;
  location: string;
  state: string;
  pincode: string;
  contactNumber: string;
  email: string;
  capacity: string;
  aadharCard: any;
  aadharCardNumber: string;
  panCard: any;
  panCardNumber: string;
  openingTime: string;
  closingTime: string;
}

const initialValues: StudioFormValues = {
  name: '',
  location: '',
  state: '',
  pincode: '',
  contactNumber: '',
  email: '',
  capacity: '',
  aadharCard: null,
  aadharCardNumber: '',
  panCard: null,
  panCardNumber: '',
  openingTime: '',
  closingTime: '',
};

const fieldLabels: Record<keyof StudioFormValues, string> = {
  name: 'Studio Name',
  location: 'Location',
  state: 'State',
  pincode: 'Pincode',
  contactNumber: 'Contact Number',
  email: 'Email',
  capacity: 'Capacity',
  aadharCard: 'Aadhaar Card Upload',
  aadharCardNumber: 'Aadhaar Card Number',
  panCard: 'PAN Card Upload',
  panCardNumber: 'PAN Card Number',
  openingTime: 'Opening Time',
  closingTime: 'Closing Time',
};

const maxLengths: Record<keyof StudioFormValues, number> = {
  name: 50,
  location: 50,
  state: 50,
  pincode: 6,
  contactNumber: 15,
  email: 100,
  capacity: 5,
  aadharCard: 0, // no maxLength (file)
  aadharCardNumber: 12,
  panCard: 0, // no maxLength (file)
  panCardNumber: 10,
  openingTime: 10,
  closingTime: 10,
};


const studioSchema = yup.object().shape({
  name: yup.string().trim().required('*required').min(2, '*too short').max(50, '*too long'),
  location: yup.string().trim().required('*required').min(2, '*too short').max(50, '*too long'),
  state: yup.string().trim().required('*required').min(2, '*too short').max(50, '*too long'),
  pincode: yup.string().matches(/^[0-9]{6}$/, '*must be a valid 6-digit pincode').required('*required'),
  // contactNumber: yup.string().matches(/^[6-9][0-9]{9}$/, '*must be a valid 10-digit phone number').required('*required'),
  // email: yup.string().email('*enter valid email').required('*required'),
  capacity: yup.number().typeError('*must be a number').min(1, '*must be at least 1').required('*required'),
  aadharCard: yup.mixed().required('*Aadhaar card is required'),
  aadharCardNumber: yup.string().matches(/^[0-9]{12}$/, '*must be a valid 12-digit Aadhaar number').required('*required'),
  panCard: yup.mixed().required('*PAN card is required'),
  panCardNumber: yup.string()
    .transform(value => value?.toUpperCase())
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, '*must be a valid PAN number')
    .required('*required'),
  openingTime: yup.string().required('*required'),
  closingTime: yup.string().required('*required'),
});



const UpdateStudioProfile: React.FC = () => {
  const { user } = useSelector((state: any) => state?.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [endModal, setEndModal] = useState(false);

  // console.log("--- studio profile user details ----", user);

  return (
    <Container>
      <CustomHeader2 title="Studio Profile" />

      {/* map */}
      <View>

      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={studioSchema}
        onSubmit={(values: StudioFormValues) => {
          console.log('Submitted values:', values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }: any) => (
          <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} persistentScrollbar={true} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: moderateScale(5) }}>
              {/* Text Inputs */}
              {[
                'name',
                'location',
                'pincode',
                'capacity',
                'aadharCardNumber',
                'panCardNumber',
              ].map((field) => (
                <View key={field} style={{ marginBottom: moderateScale(0) }}>
                  <CustomInput
                    text={fieldLabels[field as keyof StudioFormValues]}
                    handleChangeText={handleChange(field)}
                    value={values[field as keyof StudioFormValues] as string}
                    maxLength={maxLengths[field as keyof StudioFormValues]}
                    keyboardType={
                      ['pincode', 'capacity', 'aadharCardNumber'].includes(field)
                        ? 'numeric'
                        : 'default'
                    }
                  />
                  {errors[field as keyof StudioFormValues] && touched[field as keyof StudioFormValues] && (
                    <CustomText color={Colors.red} customStyle={{ marginTop: moderateScale(5) }} text={errors[field as keyof StudioFormValues] as string} />
                  )}
                </View>
              ))}

              <View style={{ marginVertical: moderateScale(10) }}>
                <CustomText text='State' size={16} weight='500' customStyle={{ marginBottom: moderateScale(3) }} />
                <TouchableOpacity
                  onPress={() => setIsModalVisible(true)} // Open the modal to select state
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: moderateScale(15),
                    borderRadius: moderateScale(8),
                    // alignItems: 'center',
                    // marginTop:moderateScale(10)
                  }}
                >
                  <CustomText weight='500' text={values?.state || "Select State"} />
                </TouchableOpacity>
                {errors.state && touched.state && (
                  <CustomText color="red" customStyle={{ marginTop: moderateScale(5) }} text={errors.state as string} />
                )}
              </View>

              <StateModal showmodal={isModalVisible} setShowModal={setIsModalVisible} handleState={(country: any) => {
                console.log("--- value in the state modal ---", country);
                setFieldValue('state', country)
                setIsModalVisible(false);
              }} />

              <View style={{ marginVertical: moderateScale(10) }}>
                <CustomText text='Opening Timing' size={16} weight='500' customStyle={{ marginBottom: moderateScale(3) }} />

                {/* opening timing */}
                <TouchableOpacity
                  onPress={() => setStartModal(true)} // Open the modal to select state
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: moderateScale(15),
                    borderRadius: moderateScale(8),
                    // alignItems: 'center',
                    // marginTop:moderateScale(10)
                  }}
                >
                  <CustomText weight='500' color={values?.openingTime ? "#000000" : Colors.gray_font} text={values?.openingTime || "From"} />
                </TouchableOpacity>
                {errors.openingTime && touched.openingTime && (
                  <CustomText color="red" customStyle={{ marginTop: moderateScale(5) }} text={errors.openingTime as string} />
                )}

                <TimeModal values={values?.openingTime} timeModal={startModal} setTimeModal={setStartModal} handleTime={(time: any) => {
                  setFieldValue('openingTime', time?.value)
                  setStartModal(false);
                }} />



                {/* close timing */}
                <TouchableOpacity
                  onPress={() => setEndModal(true)} // Open the modal to select state
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: moderateScale(15),
                    borderRadius: moderateScale(8),
                    // alignItems: 'center',
                    marginTop: moderateScale(10)
                  }}
                >
                  <CustomText weight='500' color={values?.closingTime ? "#000000" : Colors.gray_font} text={values?.closingTime || "To"} />
                </TouchableOpacity>
                {errors.closingTime && touched.closingTime && (
                  <CustomText color="red" customStyle={{ marginTop: moderateScale(5) }} text={errors.closingTime as string} />
                )}

                <TimeModal values={values?.closingTime} timeModal={endModal} setTimeModal={setEndModal} handleTime={(time: any) => {
                  // console.log("--- end timing ---", time);
                  setFieldValue('closingTime', time?.value)
                  setStartModal(false);
                }} />

              </View>


              {/* Aadhaar Upload */}
              {/* <View style={{ marginBottom: 10 }}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                onPress={() => pickDocument(setFieldValue, 'aadharCard')}
              >
                <Text>
                  {values.aadharCard ? values.aadharCard.name : 'Choose Aadhaar Card'}
                </Text>
              </TouchableOpacity>
              {errors.aadharCard && touched.aadharCard && (
                <CustomText text={errors.aadharCard as string} />
              )}
            </View> */}

              {/* PAN Upload */}
              {/* <View style={{ marginBottom: 10 }}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                onPress={() => pickDocument(setFieldValue, 'panCard')}
              >
                <Text>
                  {values.panCard ? values.panCard.name : 'Choose PAN Card'}
                </Text>
              </TouchableOpacity>
              {errors.panCard && touched.panCard && (
                <CustomText text={errors.panCard as string} />
              )}
            </View> */}

              {/* Submit */}
              <CustomButton onPress={handleSubmit} title="Submit" customStyle={{ marginTop: moderateScale(10) }} />
              <View style={{ marginBottom: moderateScale(50) }} />
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Formik>

    </Container>
  )
}

export default UpdateStudioProfile

const styles = StyleSheet.create({})